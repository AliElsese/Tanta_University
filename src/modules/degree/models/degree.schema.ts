import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Grade } from "../enums/grade.enum";

@Schema({
    timestamps: true
})

export class Degree extends Document {
    @Prop({ required: [true, 'Degree is required'] })
    subjectDegree: Number;

    @Prop({ required: [true, 'GBA is required'] })
    GBA: Number;

    @Prop({ required: [true, 'Grade is required'], enum: Grade })
    grade: Grade;

    @Prop({ type: Types.ObjectId, ref: 'Subject' })
    subjectId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);