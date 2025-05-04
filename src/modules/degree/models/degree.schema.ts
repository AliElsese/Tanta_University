import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Grade } from "../enums/grade.enum";
import { SubjectTerm } from "src/modules/subject/enums/subject.enum";

@Schema({
    timestamps: true
})

export class Degree extends Document {
    @Prop({ required: [true, 'Degree is required'], default: 0 })
    subjectDegree: Number;

    @Prop({ required: [true, 'GBA is required'], default: 0 })
    GBA: Number;

    @Prop({ required: [true, 'Grade is required'], enum: Grade, default: Grade.Fail })
    grade: Grade;

    @Prop({ required: [true, 'Term is required'], enum: SubjectTerm })
    term: SubjectTerm;

    @Prop({ type: Types.ObjectId, ref: 'Subject' })
    subjectId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);