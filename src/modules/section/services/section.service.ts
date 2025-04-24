import { Injectable } from "@nestjs/common";
import { NewSectionDto } from "../dtos/newSection";
import { InjectModel } from "@nestjs/mongoose";
import { Section } from "../models/section.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

interface PopulatedYear {
    name: string;
}

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSection(sectionDto: NewSectionDto) {
        const { name, yearId } = sectionDto;

        const sectionExist = await this.SectionModel.findOne({ name });
        if(sectionExist) {
            throw new CustomError(400, 'This section already exist.');
        }

        const newSection = await this.SectionModel.create({
            name, yearId
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
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, yearId: 1 });
        
        const newSections = sections.map((section) => {
            return {
                _id: section._id,
                name: section.name,
                yearName: section.yearId.name
            }
        })

        return {
            message: 'Sections data.',
            newSections,
            totalPages: Math.ceil(sections.length / limit),
            currentPage: page,
            totalSections: sections.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSection(sectionId: string) {
        const section = await this.SectionModel.findById({ _id: new mongoose.Types.ObjectId(sectionId) }).populate('yearId', { name: 1 }).select({ _id: 1, name: 1 });

        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        return {
            message: 'Section data.',
            section
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