import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Subject extends Document {
    @Prop({ required: [true, 'Subject Name is required'] })
    name: string;

    @Prop({ required: [true, 'Subject Code is required'] })
    code: string;

    @Prop({ required: [true, 'Subject Hours is required'], default: 0 })
    hoursNumber: Number;

    @Prop({ required: [true, 'Highest Degree is required'] })
    highestDegree: number;

    @Prop({ type: Types.ObjectId, ref: 'Doctor' })
    doctorId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);