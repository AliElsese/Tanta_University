import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { SubjectService } from "../services/subject.service";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";

@Controller('subject')
@ApiTags('subject')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class SubjectController {
    constructor(
        private SubjectService: SubjectService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createSubject')
    @ApiOperation({ summary: 'Create subject' })
    @ApiBody({ description: 'Subject inputs', type: NewSubjectDto })
    @ApiResponse({ status: 201, description: 'Subject added successfully' })
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
    async createSubject(@Body() subjectDto: NewSubjectDto) {
        return this.SubjectService.addSubject(subjectDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll/:name')
    @ApiOperation({ summary: 'Get subjects' })
    @ApiParam({ name: 'name', required: true, description: 'The name of the section' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Subjects data' })
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
        return this.SubjectService.getSubjects(name, paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiResponse({ status: 200, description: 'Subject data' })
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
    async findOne(@Param() subjectId: string) {
        return this.SubjectService.getSubject(subjectId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiBody({ description: 'Subject update inputs', type: UpdateSubjectDto })
    @ApiResponse({ status: 200, description: 'Subject updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Subject not found' })
    @ApiResponse({ status: 400, description: 'Subject name already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') subjectId: string, @Body() subjectDto: UpdateSubjectDto) {
        return this.SubjectService.updateSubject(subjectId, subjectDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiResponse({ status: 200, description: 'Subject deleted successfully' })
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
    async deleteOne(@Param() subjectId: string) {
        return this.SubjectService.removeSubject(subjectId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('addSubjectToStudent/:studentId/:subjectId')
    @ApiOperation({ summary: 'Add subject to student' })
    @ApiParam({ name: 'studentId', required: true, description: 'The ID of the student' })
    @ApiParam({ name: 'subjectId', required: true, description: 'The ID of the subject' })
    @ApiResponse({ status: 200, description: 'Subject added to student successfully' })
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
    async addSubjectToStudent(@Param('studentId') studentId: string, @Param('subjectId') subjectId: string) {
        return this.SubjectService.addSubjectToStudent(studentId, subjectId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('getSubjectStudents/:id')
    @ApiOperation({ summary: 'Get students enrolled in a subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Students enrolled in this subject' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Subject not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getSubjectStudents(@Param('id') subjectId: string, @Query() paginationDto: PaginationDto) {
        return this.SubjectService.getSubjectStudents(subjectId, paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('getDoctorSubjects/:id')
    @ApiOperation({ summary: 'Get doctor subjects' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiResponse({ status: 200, description: 'Doctor subjects' })
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
    async getDoctorSubjects(@Param('id') doctorId: string) {
        return this.SubjectService.getDoctorSubjects(doctorId);
    }
}