import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { UpdateStudentDto } from "../dtos/updateStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Section } from "src/modules/section/models/section.schema";
import { Subject } from "src/modules/subject/models/subject.schema";
import { SubjectTerm } from "src/modules/subject/enums/subject.enum";

export interface PopulatedYear {
    _id: mongoose.Types.ObjectId;
    name: string;
}

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addStudent(studentDto: NewStudentDto) {
        const { name, nationalId, gender, universityId, phoneNumber, email, sectionName, yearId } = studentDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const userExist = await this.StudentModel.findOne({
            $or: [
                { nationalId },
                { universityId },
                { email },
                { phoneNumber }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This national ID, email, university ID or phone number already exists.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const subjectsIdsFirstTerm = await this.SubjectModel.find({ yearId: new mongoose.Types.ObjectId(yearId), term: SubjectTerm.FirstTerm }).select({ _id: 1 });
        const subjectsIdsSecondTerm = await this.SubjectModel.find({ yearId: new mongoose.Types.ObjectId(yearId), term: SubjectTerm.SecondTerm }).select({ _id: 1 });
        
        const studentSubjects = [
            {
                yearId: new mongoose.Types.ObjectId(yearId),
                term: SubjectTerm.FirstTerm,
                subjectsIds: subjectsIdsFirstTerm
            },
            {
                yearId: new mongoose.Types.ObjectId(yearId),
                term: SubjectTerm.SecondTerm,
                subjectsIds: subjectsIdsSecondTerm
            }
        ]

        const newStudent = await this.StudentModel.create({
            name, nationalId, gender, universityId,
            passwordHash: hashedPassword,
            phoneNumber, email,
            sectionId: section._id,
            yearIds: [new mongoose.Types.ObjectId(yearId)],
            academicYears: studentSubjects
        });

        return {
            message: 'Student added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudents(name: string, paginationDto: PaginationDto) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const students = await this.StudentModel.find({ sectionId: section._id })
            .skip(skip)
            .limit(limit)
            .populate<{ yearIds: PopulatedYear[] }>('yearIds', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, yearIds: 1 });
        
        const newStudents = students.map((student) => {
            return {
                _id: student._id,
                name: student.name,
                nationalId: student.nationalId,
                gender: student.gender,
                universityId: student.universityId,
                phoneNumber: student.phoneNumber,
                email: student.email,
                yearName: student.yearIds[student.yearIds.length - 1]?.name || ''
            }
        })

        return {
            message: 'Students data.',
            newStudents,
            totalPages: Math.ceil(students.length / limit),
            currentPage: page,
            totalStudents: students.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudent(studentId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1 });

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        const newStudent = {
            _id: student._id,
            name: student.name,
            nationalId: student.nationalId,
            gender: student.gender,
            universityId: student.universityId,
            phoneNumber: student.phoneNumber,
            email: student.email
        }

        return {
            message: 'Student data.',
            newStudent
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateStudent(studentId: string, studentDto: UpdateStudentDto) {
        const { name, nationalId, universityId, phoneNumber, email } = studentDto;

        const studentExist = await this.StudentModel.findOne({ 
            $or: [
                { nationalId, _id: { $ne: new mongoose.Types.ObjectId(studentId) } },
                { email, _id: { $ne: new mongoose.Types.ObjectId(studentId) } },
                { universityId, _id: { $ne: new mongoose.Types.ObjectId(studentId) } },
                { phoneNumber, _id: { $ne: new mongoose.Types.ObjectId(studentId) } }
            ]
        });
        
        if(studentExist) {
            throw new CustomError(400, 'This national ID, email, university ID or phone number already exists.');
        }

        const updatedStudent = await this.StudentModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(studentId) },
            { name, nationalId, universityId, phoneNumber, email },
            { new: true }
        ).select({ _id: 1, name: 1, nationalId: 1, universityId: 1, phoneNumber: 1, email: 1 });

        if(!updatedStudent) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Student updated successfully.'
        }
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////

    async removeStudent(studentId: string) {
        const student = await this.StudentModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(studentId) });

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Student deleted successfully.'
        }
    }
}