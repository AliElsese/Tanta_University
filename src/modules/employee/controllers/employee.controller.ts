import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EmployeeService } from "../services/employee.service";
import { NewEmployeeDto } from "../dtos/newEmployee.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('employee')
@ApiTags('employee')
export class EmployeeController {
    constructor(
        private EmployeeService: EmployeeService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createEmployee')
    @ApiOperation({ summary: 'Create employee' })
    @ApiBody({ description: 'Employee inputs', type: NewEmployeeDto })
    @ApiResponse({ status: 201, description: 'Employee added successfully' })
    async createEmployee(@Body() employeeDto: NewEmployeeDto) {
        return this.EmployeeService.addEmployee(employeeDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get employees' })
    @ApiResponse({ status: 200, description: 'Employees data' })
    async findAll() {
        return this.EmployeeService.getEmployees();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get employee' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the employee' })
    @ApiResponse({ status: 200, description: 'Employee data' })
    async findOne(@Param() employeeId: string) {
        return this.EmployeeService.getEmployee(employeeId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete employee' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the employee' })
    @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
    async deleteOne(@Param() employeeId: string) {
        return this.EmployeeService.removeEmployee(employeeId);
    }
}