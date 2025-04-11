import { Injectable } from "@nestjs/common";
import { NewEmployeeDto } from "../dtos/newEmployee.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Employee } from "../models/employee.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name)
        private EmployeeModel: mongoose.Model<Employee> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addEmployee(employeeDto: NewEmployeeDto) {
        const { name, nationalId, phoneNumber, email } = employeeDto;

        const userExist = await this.EmployeeModel.findOne({ nationalId, email });
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

    async getEmployees() {
        const employees = await this.EmployeeModel.find({ });
        
        return {
            message: 'Employees data.',
            employees
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getEmployee(employeeId: string) {
        const employee = await this.EmployeeModel.findById({ _id: new mongoose.Types.ObjectId(employeeId) });

        if(!employee) {
            throw new CustomError(404, 'Employee not found.');
        }

        return {
            message: 'Employee data.',
            employee
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