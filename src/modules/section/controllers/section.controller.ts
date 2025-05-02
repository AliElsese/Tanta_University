import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { SectionService } from "../services/section.service";
import { NewSectionDto } from "../dtos/newSection";
import { UpdateSectionDto } from "../dtos/updateSection";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('section')
@ApiTags('section')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class SectionController {
    constructor(
        private SectionService: SectionService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createSection')
    @ApiOperation({ summary: 'Create section' })
    @ApiBody({ description: 'Section inputs', type: NewSectionDto })
    @ApiResponse({ status: 201, description: 'Section added successfully' })
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
    async createSection(@Body() sectionDto: NewSectionDto) {
        return this.SectionService.addSection(sectionDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findAll')
    @ApiOperation({ summary: 'Get sections' })
    @ApiResponse({ status: 200, description: 'Sections data' })
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
    async findAll() {
        return this.SectionService.getSections();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Get('findOne/:id')
    @ApiOperation({ summary: 'Get section' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiResponse({ status: 200, description: 'Section data' })
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
    async findOne(@Param() sectionId: string) {
        return this.SectionService.getSection(sectionId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Put('updateOne/:id')
    @ApiOperation({ summary: 'Update section' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiBody({ description: 'Section update inputs', type: UpdateSectionDto })
    @ApiResponse({ status: 200, description: 'Section updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    @ApiResponse({ status: 400, description: 'Section name already exists' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async updateOne(@Param('id') sectionId: string, @Body() sectionDto: UpdateSectionDto) {
        return this.SectionService.updateSection(sectionId, sectionDto);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Delete('deleteOne/:id')
    @ApiOperation({ summary: 'Delete section' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the section' })
    @ApiResponse({ status: 200, description: 'Section deleted successfully' })
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
    async deleteOne(@Param() sectionId: string) {
        return this.SectionService.removeSection(sectionId);
    }

    
}