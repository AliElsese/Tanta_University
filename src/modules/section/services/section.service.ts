import { Injectable } from "@nestjs/common";
import { NewSectionDto } from "../dtos/newSection";
import { UpdateSectionDto } from "../dtos/updateSection";
import { InjectModel } from "@nestjs/mongoose";
import { Section } from "../models/section.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSection(sectionDto: NewSectionDto) {
        const { name, slug } = sectionDto;

        const sectionExist = await this.SectionModel.findOne({ 
            $or: [
                { name },
                { slug: slug.toUpperCase() }
            ]
        });
        if(sectionExist) {
            throw new CustomError(400, 'This section name or slug already exists.');
        }

        const newSection = await this.SectionModel.create({
            name,
            slug: slug.toUpperCase()
        });

        return {
            message: 'Section added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSections() {
        const sections = await this.SectionModel.find({ }).select({ _id: 1, name: 1, slug: 1 });

        return {
            message: 'Sections data.',
            sections
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSection(sectionId: string) {
        const section = await this.SectionModel.findById({ _id: new mongoose.Types.ObjectId(sectionId) }).select({ _id: 1, name: 1, slug: 1 });

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
        const { name, slug } = sectionDto;

        const sectionExist = await this.SectionModel.findOne({ 
            $and: [
                {
                    $or: [
                        { name },
                        { slug: slug.toUpperCase() }
                    ]
                },
                { _id: { $ne: new mongoose.Types.ObjectId(sectionId) } }
            ]
        });
        if(sectionExist) {
            throw new CustomError(400, 'This section name or slug already exists.');
        }

        const updatedSection = await this.SectionModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(sectionId) },
            { name, slug: slug.toUpperCase() },
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