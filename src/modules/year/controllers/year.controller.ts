import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { YearService } from "../services/year.service";
import { NewYearDto } from "../dtos/newYear.dto";

@Controller('year')
export class YearController {
    constructor(
        private YearService: YearService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createYear')
    async createYear(@Body() yearDto: NewYearDto) {
        return this.YearService.addYear(yearDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    async findAll() {
        return this.YearService.getYears();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    async findOne(@Param() yearId: string) {
        return this.YearService.getYear(yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    async deleteOne(@Param() yearId: string) {
        return this.YearService.removeYear(yearId);
    }
}