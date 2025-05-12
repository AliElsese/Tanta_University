import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";
import { NewDoctorDto } from "../dtos/newDoctor.dto";
import { UpdateDoctorDto } from "../dtos/updateDoctor.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
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

    @Get('findAll/:name')
    @ApiOperation({ summary: 'Get doctors' })
    @ApiParam({ name: 'name', required: true, description: 'The name of the section' })
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
    async findAll(@Param('name') name: string) {
        return this.DoctorService.getDoctors(name);
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

    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update doctor' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiBody({ description: 'Doctor update inputs', type: UpdateDoctorDto })
    @ApiResponse({ status: 200, description: 'Doctor updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Doctor not found' })
    @ApiResponse({ status: 400, description: 'Doctor name already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') doctorId: string, @Body() doctorDto: UpdateDoctorDto) {
        return this.DoctorService.updateDoctor(doctorId, doctorDto);
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