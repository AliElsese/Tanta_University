import { Injectable } from "@nestjs/common";
import { NewSectionDto } from "../dtos/newSection";
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

    async getSections() {
        const sections = await this.SectionModel.find({ });
        
        return {
            message: 'Sections data.',
            sections
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSection(sectionId: string) {
        const section = await this.SectionModel.findById({ _id: new mongoose.Types.ObjectId(sectionId) });

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