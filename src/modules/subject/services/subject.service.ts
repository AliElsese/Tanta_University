import { Injectable } from "@nestjs/common";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Subject } from "../models/subject.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Student } from "src/modules/student/models/student.schema";
import { Section } from "src/modules/section/models/section.schema";

export interface PopulatedYear {
    name: string;
}

export interface PopulatedDoctor {
    name: string;
}

@Injectable()
export class SubjectService {
    constructor(
        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>,

        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSubject(subjectDto: NewSubjectDto) {
        const { name, code, hoursNumber, highestDegree, term, doctorId, sectionName, yearId } = subjectDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const subjectExist = await this.SubjectModel.findOne({ name });
        if(subjectExist) {
            throw new CustomError(400, 'This subject already exist.');
        }

        const newSubject = await this.SubjectModel.create({
            name, code, hoursNumber, highestDegree, term,
            doctorId, sectionId: section._id, yearId
        });

        return {
            message: 'Subject added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubjects(name: string, paginationDto: PaginationDto) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const subjects = await this.SubjectModel.find({ sectionId: section._id })
            .skip(skip)
            .limit(limit)
            .populate<{ doctorId: PopulatedDoctor }>('doctorId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, doctorId: 1, yearId: 1 });
        
        const newSubjects = subjects.map((subject) => {
            return {
                _id: subject._id,
                name: subject.name,
                code: subject.code,
                hoursNumber: subject.hoursNumber,
                highestDegree: subject.highestDegree,
                doctorName: subject.doctorId.name,
                yearName: subject.yearId.name
            }
        })

        return {
            message: 'Subjects data.',
            newSubjects,
            totalPages: Math.ceil(subjects.length / limit),
            currentPage: page,
            totalSubjects: subjects.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubject(subjectId: string) {
        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) })
            .populate<{ doctorId: PopulatedDoctor }>('doctorId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, doctorId: 1, yearId: 1 });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const newSubject = {
            _id: subject._id,
            name: subject.name,
            code: subject.code,
            hoursNumber: subject.hoursNumber,
            highestDegree: subject.highestDegree,
            doctorName: subject.doctorId.name,
            yearName: subject.yearId.name
        }

        return {
            message: 'Subject data.',
            newSubject
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateSubject(subjectId: string, subjectDto: UpdateSubjectDto) {
        const { name } = subjectDto;

        const subjectExist = await this.SubjectModel.findOne({ name });
        if(subjectExist && subjectExist._id.toString() !== subjectId) {
            throw new CustomError(400, 'This subject name already exists.');
        }

        const updatedSubject = await this.SubjectModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(subjectId) },
            { name },
            { new: true }
        ).select({ _id: 1, name: 1 });

        if(!updatedSubject) {
            throw new CustomError(404, 'Subject not found.');
        }

        return {
            message: 'Subject updated successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSubject(subjectId: string) {
        const subject = await this.SubjectModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(subjectId) });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        return {
            message: 'Subject deleted successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Add subjects to student
    async addSubjectToStudent(studentId: string, subjectId: string) {
        const student = await this.StudentModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(studentId) },
            { $push: { subjectIds: new mongoose.Types.ObjectId(subjectId) } },
            { new: true }
        );

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Subject added to student successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Get students enrolled in a subject
    async getSubjectStudents(subjectId: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;

        const subject = await this.SubjectModel.findById(subjectId);
        if (!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const students = await this.StudentModel.find({ subjectIds: { $in: [new mongoose.Types.ObjectId(subjectId)] } })
            .skip(skip)
            .limit(limit)
            .select({ _id: 1, name: 1 });

        return {
            message: 'Students enrolled in this subject.',
            students,
            totalPages: Math.ceil(students.length / limit),
            currentPage: page,
            totalStudents: students.length
        }
    }
}