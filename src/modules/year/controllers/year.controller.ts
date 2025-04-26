import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { YearService } from "../services/year.service";
import { NewYearDto } from "../dtos/newYear.dto";
import { UpdateYearDto } from "../dtos/updateYear.dto";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('year')
@ApiTags('year')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class YearController {
    constructor(
        private YearService: YearService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createYear')
    @ApiOperation({ summary: 'Create year' })
    @ApiBody({ description: 'Year inputs', type: NewYearDto })
    @ApiResponse({ status: 201, description: 'Year added successfully' })
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
    async createYear(@Body() yearDto: NewYearDto) {
        return this.YearService.addYear(yearDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll/:id')
    @ApiOperation({ summary: 'Get years' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Years data' })
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
    async findAll(@Param() sectionId: string, @Query() paginationDto: PaginationDto) {
        return this.YearService.getYears(sectionId, paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get year' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Year data' })
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
    async findOne(@Param() yearId: string) {
        return this.YearService.getYear(yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update year' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the year' })
    @ApiBody({ description: 'Year update inputs', type: UpdateYearDto })
    @ApiResponse({ status: 200, description: 'Year updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Year not found' })
    @ApiResponse({ status: 400, description: 'Year name already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') yearId: string, @Body() yearDto: UpdateYearDto) {
        return this.YearService.updateYear(yearId, yearDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete year' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Year deleted successfully' })
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
    async deleteOne(@Param() yearId: string) {
        return this.YearService.removeYear(yearId);
    }
}