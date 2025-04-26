import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

export interface PopulatedYear {
    name: string;
}

export interface PopulatedSection {
    name: string;
}

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addStudent(studentDto: NewStudentDto) {
        const { name, nationalId, gender, universityId, phoneNumber, email, sectionId, yearId } = studentDto;

        const userExist = await this.StudentModel.findOne({
            $or: [
                { nationalId },
                { universityId },
                { email }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This user already exist.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newStudent = await this.StudentModel.create({
            name, nationalId, gender, universityId,
            passwordHash: hashedPassword,
            phoneNumber, email,
            sectionId, yearId
        });

        return {
            message: 'Student added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudents(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const students = await this.StudentModel.find({ })
            .skip(skip)
            .limit(limit)
            .populate<{ sectionId: PopulatedSection }>('sectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, sectionId: 1, yearId: 1 });
        
        const newStudents = students.map((student) => {
            return {
                _id: student._id,
                name: student.name,
                nationalId: student.nationalId,
                gender: student.gender,
                universityId: student.universityId,
                phoneNumber: student.phoneNumber,
                email: student.email,
                sectionName: student.sectionId.name,
                yearName: student.yearId.name
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
            .populate<{ sectionId: PopulatedSection }>('sectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, sectionId: 1, yearId: 1 });

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
            email: student.email,
            sectionName: student.sectionId.name,
            yearName: student.yearId.name
        }

        return {
            message: 'Student data.',
            newStudent
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