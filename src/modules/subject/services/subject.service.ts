import { Injectable } from "@nestjs/common";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Subject } from "../models/subject.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Student } from "src/modules/student/models/student.schema";

export interface PopulatedYear {
    name: string;
}

export interface PopulatedSection {
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

        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSubject(subjectDto: NewSubjectDto) {
        const { name, code, hoursNumber, highestDegree, term, doctorId, sectionId, yearId } = subjectDto;

        const subjectExist = await this.SubjectModel.findOne({ name });
        if(subjectExist) {
            throw new CustomError(400, 'This subject already exist.');
        }

        const newSubject = await this.SubjectModel.create({
            name, code, hoursNumber, highestDegree, term,
            doctorId, sectionId, yearId
        });

        return {
            message: 'Subject added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubjects(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const subjects = await this.SubjectModel.find({ })
            .skip(skip)
            .limit(limit)
            .populate<{ doctorId: PopulatedDoctor }>('doctorId', { _id: 0, name: 1 })
            .populate<{ sectionId: PopulatedSection }>('sectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, doctorId: 1, sectionId: 1, yearId: 1 });
        
        const newSubjects = subjects.map((subject) => {
            return {
                _id: subject._id,
                name: subject.name,
                code: subject.code,
                hoursNumber: subject.hoursNumber,
                highestDegree: subject.highestDegree,
                doctorName: subject.doctorId.name,
                sectionName: subject.sectionId.name,
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
            .populate<{ sectionId: PopulatedSection }>('sectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, doctorId: 1, sectionId: 1, yearId: 1 });

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
            sectionName: subject.sectionId.name,
            yearName: subject.yearId.name
        }

        return {
            message: 'Subject data.',
            newSubject
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

    async getSubjectStudents(subjectId: string) {
        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const students = await this.StudentModel.find({ sectionId: subject.sectionId }).select({ _id: 1, name: 1, code: 1 });

        return {
            message: 'Subject students data.',
            students
        }
    }
}