import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { SectionService } from "../services/section.service";
import { NewSectionDto } from "../dtos/newSection";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('section')
@ApiTags('section')
export class SectionController {
    constructor(
        private SectionService: SectionService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createSection')
    @ApiOperation({ summary: 'Create section' })
    @ApiBody({ description: 'Section inputs', type: NewSectionDto })
    @ApiResponse({ status: 201, description: 'Section added successfully' })
    async createSection(@Body() sectionDto: NewSectionDto) {
        return this.SectionService.addSection(sectionDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get sections' })
    @ApiResponse({ status: 200, description: 'Sections data' })
    async findAll() {
        return this.SectionService.getSections();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get section' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiResponse({ status: 200, description: 'Section data' })
    async findOne(@Param() sectionId: string) {
        return this.SectionService.getSection(sectionId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete section' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiResponse({ status: 200, description: 'Section deleted successfully' })
    async deleteOne(@Param() sectionId: string) {
        return this.SectionService.removeSection(sectionId);
    }
}