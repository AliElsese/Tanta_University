import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { SubjectService } from "../services/subject.service";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

@Controller('subject')
@ApiTags('subject')
export class SubjectController {
    constructor(
        private SubjectService: SubjectService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createSubject')
    @ApiOperation({ summary: 'Create subject' })
    @ApiBody({ description: 'Subject inputs', type: NewSubjectDto })
    @ApiResponse({ status: 201, description: 'Subject added successfully' })
    async createSubject(@Body() subjectDto: NewSubjectDto) {
        return this.SubjectService.addSubject(subjectDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get subjects' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Subjects data' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.SubjectService.getSubjects(paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiResponse({ status: 200, description: 'Subject data' })
    async findOne(@Param() subjectId: string) {
        return this.SubjectService.getSubject(subjectId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete subject' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the subject' })
    @ApiResponse({ status: 200, description: 'Subject deleted successfully' })
    async deleteOne(@Param() subjectId: string) {
        return this.SubjectService.removeSubject(subjectId);
    }
}