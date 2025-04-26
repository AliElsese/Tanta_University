import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";
import { NewDoctorDto } from "../dtos/newDoctor.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('doctor')
@ApiTags('doctor')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class DoctorController {
    constructor(
        private DoctorService: DoctorService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createDoctor')
    @ApiOperation({ summary: 'Create doctor' })
    @ApiBody({ description: 'Doctor inputs', type: NewDoctorDto })
    @ApiResponse({ status: 201, description: 'Doctor added successfully' })
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
    async createDoctor(@Body() doctorDto: NewDoctorDto) {
        return this.DoctorService.addDoctor(doctorDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get doctors' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Doctors data' })
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
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.DoctorService.getDoctors(paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get doctor' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiResponse({ status: 200, description: 'Doctor data' })
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
    async findOne(@Param() doctorId: string) {
        return this.DoctorService.getDoctor(doctorId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete doctor' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiResponse({ status: 200, description: 'Doctor deleted successfully' })
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
    async deleteOne(@Param() doctorId: string) {
        return this.DoctorService.removeDoctor(doctorId);
    }
}