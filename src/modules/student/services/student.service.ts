import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { UpdateStudentDto } from "../dtos/updateStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

export interface PopulatedYear {
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
                { email },
                { phoneNumber }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This national ID, email, university ID or phone number already exists.');
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

    async getStudents(sectionId: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const students = await this.StudentModel.find({ sectionId })
            .skip(skip)
            .limit(limit)
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, yearId: 1 });
        
        const newStudents = students.map((student) => {
            return {
                _id: student._id,
                name: student.name,
                nationalId: student.nationalId,
                gender: student.gender,
                universityId: student.universityId,
                phoneNumber: student.phoneNumber,
                email: student.email,
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
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, yearId: 1 });

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
            yearName: student.yearId.name
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