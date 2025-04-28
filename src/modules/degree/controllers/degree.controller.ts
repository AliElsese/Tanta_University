import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { DegreeService } from "../services/degree.service";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";
import { UpdateDegreeDto } from "../dtos/updateDegree.dto";

@Controller('degree')
@ApiTags('degree')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class DegreeController {
    constructor(
        private DegreeService: DegreeService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
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

    @Roles(UserRole.EMPLOYEE, UserRole.DOCTOR, UserRole.STUDENT)
    @Get('showSubjectDegrees/:id')
    @ApiOperation({ summary: 'Get subject degrees' })
    @ApiParam({ name: 'id', required: true, type: String, description: 'ID of the subject' })
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
    async showSubjectDegrees(@Param('id') subjectId: string) {
        return this.DegreeService.showSubjectDegrees(subjectId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Put('updateDegree/:degreeId')
    @ApiOperation({ summary: 'Update degree' })
    @ApiParam({ name: 'degreeId', required: true, type: String, description: 'ID of the degree' })
    @ApiBody({ description: 'Degree inputs', type: UpdateDegreeDto })
    @ApiResponse({ status: 200, description: 'Degree updated successfully' })
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
    async updateStudentDegree(@Param() degreeId: string, @Body() updateDegreeDto: UpdateDegreeDto) {
        return this.DegreeService.updateDegree(degreeId, updateDegreeDto);
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
}