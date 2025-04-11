import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { SubjectService } from "../services/subject.service";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

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
    @ApiResponse({ status: 200, description: 'Subjects data' })
    async findAll() {
        return this.SubjectService.getSubjects();
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