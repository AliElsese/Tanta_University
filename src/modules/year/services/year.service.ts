import { Injectable } from "@nestjs/common";
import { NewYearDto } from "../dtos/newYear.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Year } from "../models/year.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

@Injectable()
export class YearService {
    constructor(
        @InjectModel(Year.name)
        private YearModel: mongoose.Model<Year> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addYear(yearDto: NewYearDto) {
        const { name } = yearDto;

        const yearExist = await this.YearModel.findOne({ name });
        if(yearExist) {
            throw new CustomError(400, 'This year already exist.');
        }

        const newYear = await this.YearModel.create({ name });

        return {
            message: 'Year added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getYears(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const years = await this.YearModel.find({ }).skip(skip).limit(limit).select({ _id: 1, name: 1 });
        
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