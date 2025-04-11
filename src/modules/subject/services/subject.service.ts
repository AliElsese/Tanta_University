import { Injectable } from "@nestjs/common";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Subject } from "../models/subject.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";

@Injectable()
export class SubjectService {
    constructor(
        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSubject(subjectDto: NewSubjectDto) {
        const { name, code, hoursNumber, highestDegree, doctorId, sectionId, yearId } = subjectDto;

        const subjectExist = await this.SubjectModel.findOne({ name });
        if(subjectExist) {
            throw new CustomError(400, 'This subject already exist.');
        }

        const newSubject = await this.SubjectModel.create({
            name, code, hoursNumber, highestDegree,
            doctorId, sectionId, yearId
        });

        return {
            message: 'Subject added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubjects() {
        const subjects = await this.SubjectModel.find({ });
        
        return {
            message: 'Subjects data.',
            subjects
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubject(subjectId: string) {
        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        return {
            message: 'Subject data.',
            subject
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSubject(subjectId: string) {
        const subject = await this.SubjectModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(subjectId) });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        return {
            message: 'Subject deleted successfully.'
        }
    }
}