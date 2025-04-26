import { Injectable } from "@nestjs/common";
import { NewSubSectionDto } from "../dtos/newSubSection";
import { InjectModel } from "@nestjs/mongoose";
import { SubSection } from "../models/subsection.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

interface PopulatedSection {
    name: string;
}

interface PopulatedYear {
    name: string;
}

@Injectable()
export class SubSectionService {
    constructor(
        @InjectModel(SubSection.name)
        private SubSectionModel: mongoose.Model<SubSection> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSection(sectionDto: NewSubSectionDto) {
        const { name, mainSectionId, yearId } = sectionDto;

        const sectionExist = await this.SubSectionModel.findOne({ name });
        if(sectionExist) {
            throw new CustomError(400, 'This section already exist.');
        }

        const newSection = await this.SubSectionModel.create({
            name, mainSectionId, yearId
        });

        return {
            message: 'Section added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSections(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const sections = await this.SubSectionModel.find({ })
            .skip(skip)
            .limit(limit)
            .populate<{ mainSectionId: PopulatedSection }>('mainSectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, mainSectionId: 1, yearId: 1 });
        
        const newSections = sections.map((section) => {
            return {
                _id: section._id,
                name: section.name,
                mainSectionName: section.mainSectionId.name,
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
        const section = await this.SubSectionModel.findById({ _id: new mongoose.Types.ObjectId(sectionId) })
            .populate<{ mainSectionId: PopulatedSection }>('mainSectionId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, mainSectionId: 1, yearId: 1 });

        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const newSection = {
            _id: section._id,
            name: section.name,
            mainSectionName: section.mainSectionId.name,
            yearName: section.yearId.name
        }

        return {
            message: 'Section data.',
            newSection
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSection(sectionId: string) {
        const section = await this.SubSectionModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(sectionId) });

        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        return {
            message: 'Section deleted successfully.'
        }
    }
}