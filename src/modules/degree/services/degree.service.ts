import { Injectable } from "@nestjs/common";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Degree } from "../models/degree.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { Subject } from "src/modules/subject/models/subject.schema";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { UpdateDegreeDto } from "../dtos/updateDegree.dto";
import { DegreeCalcService } from "src/modules/shared/services/degreeCalc.service";

export interface PopulatedStudent {
    name: string;
}

@Injectable()
export class DegreeService {
    constructor(
        @InjectModel(Degree.name)
        private DegreeModel: mongoose.Model<Degree>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        private DegreeCalcService: DegreeCalcService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addDegree(degreeDto: NewDegreeDto) {
        const { studentDegrees, subjectId, highestDegree } = degreeDto;

        const subject = await this.SubjectModel.findById(subjectId);
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
            subjectId: new mongoose.Types.ObjectId(subjectId),
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
                subjectId: new mongoose.Types.ObjectId(subjectId),
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
        const subjectDegree = await this.DegreeModel.find({ _id: new mongoose.Types.ObjectId(degreeId) }).select({ _id: 1, subjectDegree: 1 });

        if (!subjectDegree) {
            throw new CustomError(404, 'Degree not found.');
        }

        return {
            message: 'Subject degree',
            subjectDegree
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async showSubjectDegrees(subjectId: string) {
        const subjectDegrees = await this.DegreeModel.find({ 
            subjectId: new mongoose.Types.ObjectId(subjectId)
        })
        .populate<{ studentId: PopulatedStudent }>('studentId', { _id: 0, name: 1 })
        .select({ _id: 1, subjectDegree: 1, GBA: 1, grade: 1, studentId: 1, subjectId: 1 });

        const degrees = subjectDegrees.map(degree => ({
            _id: degree._id,
            subjectDegree: degree.subjectDegree,
            GBA: degree.GBA,
            grade: degree.grade,
            studentName: degree.studentId
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

    async studentYearDegrees(yearDegreesDto: StudentYearDegreesDto) {
        const { studentId, yearId } = yearDegreesDto;

        const studentDegrees = await this.DegreeModel.find({ studentId, yearId }).populate({ path: 'subjectId', select: 'name' });

        return {
            message: 'Student degrees',
            studentDegrees
        }
    }
}