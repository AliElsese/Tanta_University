import { Injectable } from "@nestjs/common";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Degree } from "../models/degree.schema";
import mongoose, { Types } from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { Subject } from "src/modules/subject/models/subject.schema";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { UpdateDegreeDto } from "../dtos/updateDegree.dto";
import { DegreeCalcService } from "src/modules/shared/services/degreeCalc.service";
import { Student } from "src/modules/student/models/student.schema";
import { StudentSubjects } from "src/modules/student/models/studentSubjects.schema";

export interface PopulatedStudent {
    id: string;
    name: string;
}

export interface PopulatedSubject {
    name: string;
    highestDegree: number;
}

@Injectable()
export class DegreeService {
    constructor(
        @InjectModel(Degree.name)
        private DegreeModel: mongoose.Model<Degree>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>,

        @InjectModel(StudentSubjects.name)
        private StudentSubjectsModel: mongoose.Model<StudentSubjects>,

        private DegreeCalcService: DegreeCalcService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addDegree(degreeDto: NewDegreeDto) {
        const { studentDegrees, subjectName, highestDegree } = degreeDto;

        const subject = await this.SubjectModel.findOne({ name: subjectName });
        if(!subject) {
            throw new CustomError(404, 'This subject not found.');
        }

        // Check for duplicate student IDs in the input
        const studentIds = studentDegrees.map(sd => sd.studentId);
        const uniqueStudentIds = new Set(studentIds);
        if (studentIds.length !== uniqueStudentIds.size) {
            throw new CustomError(400, 'Duplicate student IDs found in the input.');
        }

        // Check if any of the degrees already exist
        const existingDegrees = await this.DegreeModel.find({
            subjectId: subject._id,
            studentId: { $in: studentIds.map(id => new mongoose.Types.ObjectId(id)) }
        });

        if(existingDegrees.length > 0) {
            const existingStudentIds = existingDegrees.map(degree => degree.studentId.toString());
            throw new CustomError(400, `Degrees already exist for students with IDs: ${existingStudentIds.join(', ')}`);
        }

        // Calculate GBA for each student and create degrees
        const degreesToCreate = await Promise.all(studentDegrees.map(async (studentDegree) => {
            const gba = await this.DegreeCalcService.calculateGBA(Number(highestDegree), Number(studentDegree.subjectDegree));
            const grade = await this.DegreeCalcService.calculateAcademicGrade(Number(gba));
        
            return {
                subjectDegree: studentDegree.subjectDegree,
                GBA: gba,
                grade: grade,
                term: subject.term,
                studentId: new mongoose.Types.ObjectId(studentDegree.studentId),
                subjectId: subject._id,
                yearId: subject.yearId
            };
        }));

        await this.DegreeModel.insertMany(degreesToCreate);

        return {
            message: 'Degrees added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async showSingleDegree(degreeId: string) {
        const subjectDegree = await this.DegreeModel.findOne({ _id: new mongoose.Types.ObjectId(degreeId) }).select({ _id: 1, subjectDegree: 1, subjectId: 1 });

        if (!subjectDegree) {
            throw new CustomError(404, 'Degree not found.');
        }

        return {
            message: 'Subject degree',
            subjectDegree
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async showSubjectDegrees(subjectName: string) {
        const subject = await this.SubjectModel.findOne({ name: subjectName });
        if(!subject) {
            throw new CustomError(404, 'Subject not found.')
        }

        const subjectDegrees = await this.DegreeModel.find({ 
            subjectId: subject._id
        })
        .populate<{ studentId: PopulatedStudent }>('studentId', { _id: 1, name: 1 })
        .select({ _id: 1, subjectDegree: 1, GBA: 1, grade: 1, studentId: 1, subjectId: 1 });

        const degrees = subjectDegrees.map(degree => ({
            _id: degree._id,
            subjectDegree: degree.subjectDegree,
            GBA: degree.GBA,
            grade: degree.grade,
            studentId: degree.studentId
        }));

        return {
            message: 'Subject degrees',
            degrees
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateDegree(degreeId: string, updateDegreeDto: UpdateDegreeDto) {
        const { subjectDegree, subjectId } = updateDegreeDto;

        const subject = await this.SubjectModel.findById(subjectId);
        if (!subject) {
            throw new CustomError(404, 'Subject not found.');
        }
        
        const gba = await this.DegreeCalcService.calculateGBA(Number(subject.highestDegree), Number(subjectDegree));
        const grade = await this.DegreeCalcService.calculateAcademicGrade(Number(gba));

        const degree = await this.DegreeModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(degreeId) }, 
            { subjectDegree, GBA: gba, grade }, 
            { new: true }
        );
        
        if(!degree) {
            throw new CustomError(404, 'This degree not found.');
        }
        
        return {
            message: 'Degree updated successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async studentYearDegrees(studentId: string, yearId: string) {
        const studentDegrees = await this.DegreeModel.find(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: new mongoose.Types.ObjectId(yearId) }
        )
        .populate<{ subjectId: PopulatedSubject }>('subjectId', { _id: 1, name: 1, term: 1, highestDegree: 1 })
        .select({ subjectDegree: 1, GBA: 1, grade: 1 })

        let allHighestDegrees = 0;
        studentDegrees.forEach((degree) => {
            allHighestDegrees += Number(degree.subjectId.highestDegree)
        })

        let allStudentDegrees = 0;
        studentDegrees.forEach((degree) => {
            allStudentDegrees += Number(degree.subjectDegree)
        })

        const yearGba = await this.DegreeCalcService.calculateGBA(Number(allHighestDegrees), Number(allStudentDegrees));
        const yearGrade = await this.DegreeCalcService.calculateAcademicGrade(Number(yearGba));

        return {
            message: 'Student degrees',
            studentDegrees,
            yearGba,
            yearGrade
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async passedStudents(yearId: string, nextYearId: string) {
        const studentsIds = await this.StudentModel.find({ yearIds: { $in: [new mongoose.Types.ObjectId(yearId)] } }).select({ _id: 1 });

        const yearsGba = await Promise.all(studentsIds.map(async (student) => {
            return {
                studentId: student._id.toString(),
                yearGba: await this.studentYearGba((student._id).toString(), yearId)
            };
        }))

        const successStudents = yearsGba.filter((student) => {
            return Number(student.yearGba) > 2
        }).map((student) => student.studentId);

        await this.StudentModel.updateMany(
            {
                _id: { $in: successStudents.map(id => new mongoose.Types.ObjectId(id)) },
                yearIds: { $ne: new mongoose.Types.ObjectId(nextYearId) }
            },
            {
                $addToSet: { yearIds: new mongoose.Types.ObjectId(nextYearId) }
            }
        );

        // Get all subjects for next year
        const nextYearSubjects = await this.SubjectModel.find({ yearId: new mongoose.Types.ObjectId(nextYearId) });

        // Add subjects to StudentSubjects for each passed student
        const studentSubjectsToCreate = [];
        for (const studentId of successStudents) {
            // Get existing subjects for this student in next year
            const existingSubjects = await this.StudentSubjectsModel.find({
                studentId: new mongoose.Types.ObjectId(studentId),
                yearId: new mongoose.Types.ObjectId(nextYearId)
            }).select('subjectId');

            const existingSubjectIds = existingSubjects.map(sub => sub.subjectId.toString());

            // Only add subjects that don't already exist for this student
            for (const subject of nextYearSubjects) {
                if (!existingSubjectIds.includes(subject._id.toString())) {
                    studentSubjectsToCreate.push({
                        studentId: new mongoose.Types.ObjectId(studentId),
                        yearId: new mongoose.Types.ObjectId(nextYearId),
                        subjectId: subject._id
                    });
                }
            }
        }

        if (studentSubjectsToCreate.length > 0) {
            await this.StudentSubjectsModel.insertMany(studentSubjectsToCreate);
        }

        return {
            message: 'Students passed successfully and next year subjects added.'
        };
    }

    async studentYearGba(studentId: string, yearId: string) {
        const studentDegrees = await this.DegreeModel.find(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: new mongoose.Types.ObjectId(yearId) }
        )
        .populate<{ subjectId: PopulatedSubject }>('subjectId', { _id: 1, name: 1, term: 1, highestDegree: 1 })
        .select({ subjectDegree: 1, GBA: 1, grade: 1 })

        let allHighestDegrees = 0;
        studentDegrees.forEach((degree) => {
            allHighestDegrees += Number(degree.subjectId.highestDegree)
        })

        let allStudentDegrees = 0;
        studentDegrees.forEach((degree) => {
            allStudentDegrees += Number(degree.subjectDegree)
        })

        const yearGba = await this.DegreeCalcService.calculateGBA(Number(allHighestDegrees), Number(allStudentDegrees));

        return yearGba
    }
}