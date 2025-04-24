import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { YearService } from "../services/year.service";
import { NewYearDto } from "../dtos/newYear.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

@Controller('year')
@ApiTags('year')
export class YearController {
    constructor(
        private YearService: YearService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createYear')
    @ApiOperation({ summary: 'Create year' })
    @ApiBody({ description: 'Year inputs', type: NewYearDto })
    @ApiResponse({ status: 201, description: 'Year added successfully' })
    async createYear(@Body() yearDto: NewYearDto) {
        return this.YearService.addYear(yearDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get years' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'Years data' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.YearService.getYears(paginationDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get year' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Year data' })
    async findOne(@Param() yearId: string) {
        return this.YearService.getYear(yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete year' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Year deleted successfully' })
    async deleteOne(@Param() yearId: string) {
        return this.YearService.removeYear(yearId);
    }
}