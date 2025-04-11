import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { StudentService } from "../services/student.service";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('student')
@ApiTags('student')
export class StudentController {
    constructor(
        private StudentService: StudentService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createStudent')
    @ApiOperation({ summary: 'Create student' })
    @ApiBody({ description: 'Student inputs', type: NewStudentDto })
    @ApiResponse({ status: 201, description: 'Student added successfully' })
    async createStudent(@Body() studentDto: NewStudentDto) {
        return this.StudentService.addStudent(studentDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get students' })
    @ApiResponse({ status: 200, description: 'Students data' })
    async findAll() {
        return this.StudentService.getStudents();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get student' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the student' })
    @ApiResponse({ status: 200, description: 'Student data' })
    async findOne(@Param() studentId: string) {
        return this.StudentService.getStudent(studentId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete student' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the student' })
    @ApiResponse({ status: 200, description: 'Student deleted successfully' })
    async deleteOne(@Param() studentId: string) {
        return this.StudentService.removeStudent(studentId);
    }
}