import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";
import { NewDoctorDto } from "../dtos/newDoctor.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('doctor')
@ApiTags('doctor')
export class DoctorController {
    constructor(
        private DoctorService: DoctorService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createDoctor')
    @ApiOperation({ summary: 'Create doctor' })
    @ApiBody({ description: 'Doctor inputs', type: NewDoctorDto })
    @ApiResponse({ status: 201, description: 'Doctor added successfully' })
    async createDoctor(@Body() doctorDto: NewDoctorDto) {
        return this.DoctorService.addDoctor(doctorDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get doctors' })
    @ApiResponse({ status: 200, description: 'Doctors data' })
    async findAll() {
        return this.DoctorService.getDoctors();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get doctor' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiResponse({ status: 200, description: 'Doctor data' })
    async findOne(@Param() doctorId: string) {
        return this.DoctorService.getDoctor(doctorId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete doctor' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the doctor' })
    @ApiResponse({ status: 200, description: 'Doctor deleted successfully' })
    async deleteOne(@Param() doctorId: string) {
        return this.DoctorService.removeDoctor(doctorId);
    }
}