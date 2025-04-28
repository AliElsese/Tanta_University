import { Injectable } from "@nestjs/common";
import { NewDegreeDto } from "../dtos/newDegree.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Degree } from "../models/degree.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { Subject } from "src/modules/subject/models/subject.schema";
import { StudentYearDegreesDto } from "../dtos/yearDegree.dto";
import { SubjectDegreesDto } from "../dtos/subjectDegree.dto";

interface StudentDegree {
    studentId: string;
    subjectDegree: string;
}

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
        const { studentDegrees, subjectId, highestDegree } = degreeDto;

        const subject = await this.SubjectModel.findById(subjectId);
        if(!subject) {
            throw new CustomError(404, 'This subject not found.');
        }

        // Check for duplicate student IDs in the input
        const studentIds = studentDegrees.map(sd => sd.studentId);
        const uniqueStudentIds = new Set(studentIds);
        if (studentIds.length !== uniqueStudentIds.size) {
            throw new CustomError(400, 'Duplicate student IDs found in the input.');
        }

        // Check if any of the degrees already exist
        const existingDegrees = await this.DegreeModel.find({
            subjectId: new mongoose.Types.ObjectId(subjectId),
            studentId: { $in: studentIds.map(id => new mongoose.Types.ObjectId(id)) }
        });

        if(existingDegrees.length > 0) {
            const existingStudentIds = existingDegrees.map(degree => degree.studentId.toString());
            throw new CustomError(400, `Degrees already exist for students with IDs: ${existingStudentIds.join(', ')}`);
        }

        // Calculate GBA for each student and create degrees
        const degreesToCreate = studentDegrees.map(studentDegree => ({
            subjectDegree: studentDegree.subjectDegree,
            GBA: ((Number(studentDegree.subjectDegree) / Number(highestDegree)) * 4).toFixed(2),
            studentId: new mongoose.Types.ObjectId(studentDegree.studentId),
            subjectId: new mongoose.Types.ObjectId(subjectId),
            yearId: subject.yearId
        }));

        await this.DegreeModel.insertMany(degreesToCreate);

        return {
            message: 'Degrees added successfully.'
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