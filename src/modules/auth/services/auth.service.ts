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
import { EmployeeService } from "src/modules/employee/services/employee.service";
import { DoctorService } from "src/modules/doctor/services/doctor.service";
import { StudentService } from "src/modules/student/services/student.service";

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

        private EmployeeService: EmployeeService,

        private DoctorService: DoctorService,

        private StudentService: StudentService
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

            const accessToken = await this.JWTService.generateAccessToken({ id: employee._id.toString(), role: userType });

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

            const accessToken = await this.JWTService.generateAccessToken({ id: doctor._id.toString(), role: userType });

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

            const accessToken = await this.JWTService.generateAccessToken({ id: student._id.toString(), role: userType });

            return {
                message: 'User login successfully.',
                accessToken
            }
        }
        else {
            throw new CustomError(400, 'User type not found.')
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async userData(token: string) {
        const tokenPayload = await this.JWTService.verifyToken(token);
        const { id, role } = tokenPayload;

        if(role === 'employee') {
            const user = await this.EmployeeService.getEmployee(id);
            if (!user) {
                throw new CustomError(404, 'User not found.');
            }

            return {
                message: user.message,
                data: user.employee,
                role
            }
        }
        else if(role === 'doctor') {
            const user = await this.DoctorService.getDoctor(id);
            if (!user) {
                throw new CustomError(404, 'User not found.');
            }

            return {
                message: user.message,
                data: user.doctor,
                role
            }
        }
        else if(role === 'student') {
            const user = await this.StudentService.getStudent(id);
            if (!user) {
                throw new CustomError(404, 'User not found.');
            }            

            return {
                message: user.message,
                data: user.newStudent,
                role
            }
        }
    }
}