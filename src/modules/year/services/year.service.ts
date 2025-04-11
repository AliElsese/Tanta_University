import { Injectable } from "@nestjs/common";
import { NewYearDto } from "../dtos/newYear.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Year } from "../models/year.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";

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

    async getYears() {
        const years = await this.YearModel.find({ });
        
        return {
            message: 'Years data.',
            years
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