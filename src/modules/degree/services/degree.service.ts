import { Injectable } from "@nestjs/common";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Degree } from "../models/degree.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { Subject } from "src/modules/subject/models/subject.schema";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { SubjectDegreesDto } from "../dtos/subjectDegree.dto";

@Injectable()
export class DegreeService {
    constructor(
        @InjectModel(Degree.name)
        private DegreeModel: mongoose.Model<Degree>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addDegree(degreeDto: NewDegreeDto) {
        const { subjectDegree, studentId, subjectId, yearId } = degreeDto;

        const subject = await this.SubjectModel.findById(subjectId);
        if(!subject) {
            throw new CustomError(404, 'This subject not found.');
        }

        const degreeExist = await this.DegreeModel.findOne({ studentId, subjectId });
        if(degreeExist) {
            throw new CustomError(400, 'This degree already exist.');
        }

        const GBA = ((Number(subjectDegree) / Number(subject.highestDegree)) * 4).toFixed(2);

        const newDegree = await this.DegreeModel.create({
            subjectDegree, GBA, studentId, subjectId, yearId
        });

        return {
            message: 'Degree added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async studentYearDegrees(yearDegreesDto: StudentYearDegreesDto) {
        const { studentId, yearId } = yearDegreesDto;

        const studentDegrees = await this.DegreeModel.find({ studentId, yearId }).populate({ path: 'subjectId', select: 'name' });

        return {
            message: 'Student degrees',
            studentDegrees
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async subjectDegrees(subjectDegreesDto: SubjectDegreesDto) {
        const { subjectId } = subjectDegreesDto;

        const subjectDegrees = await this.DegreeModel.find({ subjectId }).populate({ path: 'studentId', select: 'name' });

        return {
            message: 'Subject degrees',
            subjectDegrees
        }
    }

    
}