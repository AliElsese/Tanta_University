import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { DegreeService } from "../services/degree.service";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";

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

    @Get('findAll/:studentId/:yearId')
    @ApiOperation({ summary: 'Get student year degrees' })
    @ApiParam({ name: 'studentId', required: true, type: String, description: 'ID of the student' })
    @ApiParam({ name: 'yearId', required: true, type: String, description: 'ID of the academic year' })
    @ApiResponse({ status: 200, description: 'Students degrees' })
    async findAll(@Param() yearDegreesDto: StudentYearDegreesDto) {
        return this.DegreeService.studentYearDegrees(yearDegreesDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////
}