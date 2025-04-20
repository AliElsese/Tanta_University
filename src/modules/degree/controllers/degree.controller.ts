import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { DegreeService } from "../services/degree.service";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { SubjectDegreesDto } from "../dtos/subjectDegree.dto";

@Controller('degree')
@ApiTags('degree')
export class DegreeController {
    constructor(
        private DegreeService: DegreeService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createDegree')
    @ApiOperation({ summary: 'Create degree' })
    @ApiBody({ description: 'Degree inputs', type: NewDegreeDto })
    @ApiResponse({ status: 201, description: 'Degree added successfully' })
    async createDegree(@Body() degreeDto: NewDegreeDto) {
        return this.DegreeService.addDegree(degreeDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('studentDegrees/:studentId/:yearId')
    @ApiOperation({ summary: 'Get student year degrees' })
    @ApiParam({ name: 'studentId', required: true, type: String, description: 'ID of the student' })
    @ApiParam({ name: 'yearId', required: true, type: String, description: 'ID of the academic year' })
    @ApiResponse({ status: 200, description: 'Student degrees' })
    async studentDegrees(@Param() yearDegreesDto: StudentYearDegreesDto) {
        return this.DegreeService.studentYearDegrees(yearDegreesDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('subjectDegrees/:subjectId')
    @ApiOperation({ summary: 'Get subject degrees' })
    @ApiParam({ name: 'subjectId', required: true, type: String, description: 'ID of the subject' })
    @ApiResponse({ status: 200, description: 'subject degrees' })
    async subjectDegrees(@Param() subjectDegreesDto: SubjectDegreesDto) {
        return this.DegreeService.subjectDegrees(subjectDegreesDto);
    }
}