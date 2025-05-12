import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { SubSectionService } from "../services/subsection.service";
import { NewSubSectionDto } from "../dtos/newSubSection";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('subsection')
@ApiTags('subsection')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.EMPLOYEE)
export class SubSectionController {
    constructor(
        private SubSectionService: SubSectionService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('createSection')
    @ApiOperation({ summary: 'Create section' })
    @ApiBody({ description: 'Section inputs', type: NewSubSectionDto })
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
    async createSection(@Body() sectionDto: NewSubSectionDto) {
        return this.SubSectionService.addSection(sectionDto);
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
        return this.SubSectionService.getSections();
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
        return this.SubSectionService.getSection(sectionId);
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
        return this.SubSectionService.removeSection(sectionId);
    }
}