import { Injectable } from "@nestjs/common";
import { NewEmployeeDto } from "../dtos/newEmployee.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Employee } from "../models/employee.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { UpdateEmployeeDto } from "../dtos/updateEmployee.dto";

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name)
        private EmployeeModel: mongoose.Model<Employee> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addEmployee(employeeDto: NewEmployeeDto) {
        const { name, nationalId, phoneNumber, email } = employeeDto;

        const userExist = await this.EmployeeModel.findOne({ 
            $or: [
                { nationalId },
                { phoneNumber },
                { email }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This user already exist.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newEmployee = await this.EmployeeModel.create({
            name, nationalId, phoneNumber, email,
            passwordHash: hashedPassword
        });

        return {
            message: 'Employee added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getEmployees(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const employees = await this.EmployeeModel.find({ }).skip(skip).limit(limit);
        
        return {
            message: 'Employees data.',
            employees,
            totalPages: Math.ceil(employees.length / limit),
            currentPage: page,
            totalEmployees: employees.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getEmployee(employeeId: string) {
        const employee = await this.EmployeeModel.findById({ _id: new mongoose.Types.ObjectId(employeeId) }).select(['-passwordHash', '-createdAt', '-updatedAt', '-__v']);

        if(!employee) {
            throw new CustomError(404, 'Employee not found.');
        }

        return {
            message: 'Employee data.',
            employee
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateEmployee(employeeId: string, employeeDto: UpdateEmployeeDto) {
        const { name, nationalId, phoneNumber, email } = employeeDto;

        const currentEmployee = await this.EmployeeModel.findById(employeeId);
        if (!currentEmployee) {
            throw new CustomError(404, 'Employee not found.');
        }

        const employeeExist = await this.EmployeeModel.findOne({ 
            $and: [
                {
                    $or: [
                        { nationalId },
                        { email },
                        { phoneNumber }
                    ]
                },
                { _id: { $ne: new mongoose.Types.ObjectId(employeeId) } }
            ]
        });
        if(employeeExist) {
            throw new CustomError(400, 'This national ID, email, or phone number already exists in this section.');
        }

        const updatedEmployee = await this.EmployeeModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(employeeId) },
            { name, nationalId, phoneNumber, email },
            { new: true }
        );

        return {
            message: 'Employee updated successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeEmployee(employeeId: string) {
        const employee = await this.EmployeeModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(employeeId) });

        if(!employee) {
            throw new CustomError(404, 'Employee not found.');
        }

        return {
            message: 'Employee deleted successfully.'
        }
    }
}