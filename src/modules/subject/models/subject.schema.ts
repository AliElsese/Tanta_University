import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { SubjectTerm } from "../enums/subject.enum";

@Schema({
    timestamps: true
})

export class Subject extends Document {
    @Prop({ required: [true, 'Subject Name is required'] })
    name: string;

    @Prop({ required: [true, 'Subject Code is required'] })
    code: string;

    @Prop({ required: [true, 'Subject Hours is required'], default: '3' })
    hoursNumber: string;

    @Prop({ required: [true, 'Highest Degree is required'] })
    highestDegree: string;

    @Prop({ required: [true, 'Term is required'], enum: SubjectTerm })
    term: SubjectTerm;

    @Prop({ required: [true, 'Doctor is required'], type: Types.ObjectId, ref: 'Doctor' })
    doctorId: Types.ObjectId;

    @Prop({ required: [true, 'Section is required'], type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;

    @Prop({ required: [true, 'Year is required'], type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);