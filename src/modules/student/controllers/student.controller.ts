import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { StudentService } from "../services/student.service";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { UpdateStudentDto } from "../dtos/updateStudent.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('student')
@ApiTags('student')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class StudentController {
    constructor(
        private StudentService: StudentService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Post('createStudent')
    @ApiOperation({ summary: 'Create student' })
    @ApiBody({ description: 'Student inputs', type: NewStudentDto })
    @ApiResponse({ status: 201, description: 'Student added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async createStudent(@Body() studentDto: NewStudentDto) {
        return this.StudentService.addStudent(studentDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Get('findAll/:name')
    @ApiOperation({ summary: 'Get students' })
    @ApiParam({ name: 'name', required: true, description: 'The name of the section' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Students data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async findAll(@Param('name') name: string, @Query() paginationDto: PaginationDto) {
        return this.StudentService.getStudents(name, paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get student' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the student' })
    @ApiResponse({ status: 200, description: 'Student data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async findOne(@Param() studentId: string) {
        return this.StudentService.getStudent(studentId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update student' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the student' })
    @ApiBody({ description: 'Student update inputs', type: UpdateStudentDto })
    @ApiResponse({ status: 200, description: 'Student updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiResponse({ status: 400, description: 'National ID, email, university ID or phone number already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') studentId: string, @Body() studentDto: UpdateStudentDto) {
        return this.StudentService.updateStudent(studentId, studentDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete student' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the student' })
    @ApiResponse({ status: 200, description: 'Student deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async deleteOne(@Param() studentId: string) {
        return this.StudentService.removeStudent(studentId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.STUDENT)
    @Get('getYearsByName/:name')
    @ApiOperation({ summary: 'Get student years by name' })
    @ApiParam({ name: 'name', required: true, description: 'The name of the student' })
    @ApiResponse({ status: 200, description: 'Student years retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getStudentYearsByName(@Param('name') name: string) {
        return this.StudentService.getStudentYearsByName(name);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.STUDENT)
    @Get('getSubjectsByYear/:name/:yearId')
    @ApiOperation({ summary: 'Get student subjects by year ID' })
    @ApiParam({ name: 'name', required: true, description: 'The name of the student' })
    @ApiParam({ name: 'yearId', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Student subjects retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getStudentSubjectsByYear(
        @Param('name') name: string,
        @Param('yearId') yearId: string
    ) {
        return this.StudentService.getStudentSubjectsByYear(name, yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

}