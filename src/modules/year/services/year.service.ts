import { Injectable } from "@nestjs/common";
import { NewYearDto } from "../dtos/newYear.dto";
import { UpdateYearDto } from "../dtos/updateYear.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Year } from "../models/year.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Section } from "src/modules/section/models/section.schema";
@Injectable()
export class YearService {
    constructor(
        @InjectModel(Year.name)
        private YearModel: mongoose.Model<Year>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addYear(yearDto: NewYearDto) {
        const { name, sectionName } = yearDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const yearExist = await this.YearModel.findOne({ name, sectionId: section._id });
        if(yearExist) {
            throw new CustomError(400, 'This year already exist.');
        }

        const newYear = await this.YearModel.create({ name, sectionId: section._id });

        return {
            message: 'Year added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getYears(name: string, paginationDto: PaginationDto) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const years = await this.YearModel.find({ sectionId: section._id }).skip(skip).limit(limit).select({ _id: 1, name: 1 });
        
        return {
            message: 'Years data.',
            years,
            totalPages: Math.ceil(years.length / limit),
            currentPage: page,
            totalYears: years.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getYear(yearId: string) {
        const year = await this.YearModel.findById({ _id: new mongoose.Types.ObjectId(yearId) });

        if(!year) {
            throw new CustomError(404, 'Year not found.');
        }

        return {
            message: 'Year data.',
            year
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateYear(yearId: string, yearDto: UpdateYearDto) {
        const { name } = yearDto;

        const yearExist = await this.YearModel.findOne({ name });
        if(yearExist && yearExist._id.toString() !== yearId) {
            throw new CustomError(400, 'This year name already exists.');
        }

        const updatedYear = await this.YearModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(yearId) },
            { name },
            { new: true }
        );

        if(!updatedYear) {
            throw new CustomError(404, 'Year not found.');
        }

        return {
            message: 'Year updated successfully.',
            year: updatedYear
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeYear(yearId: string) {
        const year = await this.YearModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(yearId) });

        if(!year) {
            throw new CustomError(404, 'Year not found.');
        }

        return {
            message: 'Year deleted successfully.'
        }
    }
}