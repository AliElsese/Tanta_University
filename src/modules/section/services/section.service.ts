import { Injectable } from "@nestjs/common";
import { NewSectionDto } from "../dtos/newSection";
import { UpdateSectionDto } from "../dtos/updateSection";
import { InjectModel } from "@nestjs/mongoose";
import { Section } from "../models/section.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSection(sectionDto: NewSectionDto) {
        const { name } = sectionDto;

        const sectionExist = await this.SectionModel.findOne({ name });
        if(sectionExist) {
            throw new CustomError(400, 'This section already exist.');
        }

        const newSection = await this.SectionModel.create({
            name
        });

        return {
            message: 'Section added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSections(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const sections = await this.SectionModel.find({ })
            .skip(skip)
            .limit(limit)
            .select({ _id: 1, name: 1 });

        return {
            message: 'Sections data.',
            sections,
            totalPages: Math.ceil(sections.length / limit),
            currentPage: page,
            totalSections: sections.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSection(sectionId: string) {
        const section = await this.SectionModel.findById({ _id: new mongoose.Types.ObjectId(sectionId) }).select({ _id: 1, name: 1 });

        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        return {
            message: 'Section data.',
            section
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateSection(sectionId: string, sectionDto: UpdateSectionDto) {
        const { name } = sectionDto;

        const sectionExist = await this.SectionModel.findOne({ name });
        if(sectionExist && sectionExist._id.toString() !== sectionId) {
            throw new CustomError(400, 'This section name already exists.');
        }

        const updatedSection = await this.SectionModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(sectionId) },
            { name },
            { new: true }
        );

        if(!updatedSection) {
            throw new CustomError(404, 'Section not found.');
        }

        return {
            message: 'Section updated successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSection(sectionId: string) {
        const section = await this.SectionModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(sectionId) });

        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        return {
            message: 'Section deleted successfully.'
        }
    }
}