import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addStudent(studentDto: NewStudentDto) {
        const { name, nationalId, gender, code, universityId, phoneNumber, email, address, sectionId, yearId } = studentDto;

        const userExist = await this.StudentModel.findOne({ nationalId, email });
        if(userExist) {
            throw new CustomError(400, 'This user already exist.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newStudent = await this.StudentModel.create({
            name, nationalId, gender, code, universityId,
            passwordHash: hashedPassword,
            phoneNumber, email, address,
            sectionId, yearId
        });

        return {
            message: 'Student added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudents() {
        const students = await this.StudentModel.find({ });
        
        return {
            message: 'Students data.',
            students
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudent(studentId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) });

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Student data.',
            student
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