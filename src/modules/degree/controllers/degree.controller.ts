import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { DegreeService } from "../services/degree.service";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { SubjectDegreesDto } from "../dtos/subjectDegree.dto";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('degree')
@ApiTags('degree')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class DegreeController {
    constructor(
        private DegreeService: DegreeService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createDegree')
    @ApiOperation({ summary: 'Create degree' })
    @ApiBody({ description: 'Degree inputs', type: NewDegreeDto })
    @ApiResponse({ status: 201, description: 'Degree added successfully' })
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
    async createDegree(@Body() degreeDto: NewDegreeDto) {
        return this.DegreeService.addDegree(degreeDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('studentDegrees/:studentId/:yearId')
    @ApiOperation({ summary: 'Get student year degrees' })
    @ApiParam({ name: 'studentId', required: true, type: String, description: 'ID of the student' })
    @ApiParam({ name: 'yearId', required: true, type: String, description: 'ID of the academic year' })
    @ApiResponse({ status: 200, description: 'Student degrees' })
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
    async studentDegrees(@Param() yearDegreesDto: StudentYearDegreesDto) {
        return this.DegreeService.studentYearDegrees(yearDegreesDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('subjectDegrees/:subjectId')
    @ApiOperation({ summary: 'Get subject degrees' })
    @ApiParam({ name: 'subjectId', required: true, type: String, description: 'ID of the subject' })
    @ApiResponse({ status: 200, description: 'subject degrees' })
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
    async subjectDegrees(@Param() subjectDegreesDto: SubjectDegreesDto) {
        return this.DegreeService.subjectDegrees(subjectDegreesDto);
    }
}