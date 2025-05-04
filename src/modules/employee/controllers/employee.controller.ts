import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { EmployeeService } from "../services/employee.service";
import { NewEmployeeDto } from "../dtos/newEmployee.dto";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { UpdateEmployeeDto } from "../dtos/updateEmployee.dto";

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
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Employees data' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.EmployeeService.getEmployees(paginationDto);
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

    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update employee' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the employee' })
    @ApiBody({ description: 'Employee update inputs', type: UpdateEmployeeDto })
    @ApiResponse({ status: 200, description: 'Employee updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Employee not found' })
    @ApiResponse({ status: 400, description: 'Employee name already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') employeeId: string, @Body() employeeDto: UpdateEmployeeDto) {
        return this.EmployeeService.updateEmployee(employeeId, employeeDto);
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