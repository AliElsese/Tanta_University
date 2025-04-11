import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Doctor } from "src/modules/doctor/models/doctor.schema";
import { Employee } from "src/modules/employee/models/employee.schema";
import { Student } from "src/modules/student/models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { UserLoginDto } from "../dtos/userLogin.dto";
import * as bcrypt from 'bcrypt';
import { JWTService } from "src/modules/shared/services/jwt.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Employee.name)
        private EmployeeModel: mongoose.Model<Employee>,

        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>,

        @InjectModel(Doctor.name)
        private DoctorModel: mongoose.Model<Doctor>,

        private JWTService: JWTService,
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async userLogin(loginDto: UserLoginDto) {
        const { userType, nationalId, password } = loginDto;

        if(userType === 'employee') {
            const employee = await this.EmployeeModel.findOne({ nationalId });

            const passwordMatch = await bcrypt.compare(password, employee.passwordHash);
            if (!passwordMatch) {
                throw new CustomError(400, 'Wrong credentials');
            }

            const accessToken = await this.JWTService.generateAccessToken({ id: employee._id.toString(), userType });

            return {
                message: 'User login successfully.',
                accessToken
            }
        }
        else if(userType === 'doctor') {
            const doctor = await this.DoctorModel.findOne({ nationalId });

            const passwordMatch = await bcrypt.compare(password, doctor.passwordHash);
            if (!passwordMatch) {
                throw new CustomError(400, 'Wrong credentials');
            }

            const accessToken = await this.JWTService.generateAccessToken({ id: doctor._id.toString(), userType });

            return {
                message: 'User login successfully.',
                accessToken
            }
        }
        else if(userType === 'student') {
            const student = await this.StudentModel.findOne({ nationalId });

            const passwordMatch = await bcrypt.compare(password, student.passwordHash);
            if (!passwordMatch) {
                throw new CustomError(400, 'Wrong credentials');
            }

            const accessToken = await this.JWTService.generateAccessToken({ id: student._id.toString(), userType });

            return {
                message: 'User login successfully.',
                accessToken
            }
        }
        else {
            throw new CustomError(400, 'User type not found.')
        }
    }
}