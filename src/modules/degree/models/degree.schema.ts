import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Degree extends Document {
    @Prop({ required: [true, 'Degree is required'] })
    subjectDegree: Number;

    @Prop({ required: [true, 'GBA is required'] })
    GBA: Number;

    @Prop({ type: Types.ObjectId, ref: 'Subject' })
    subjectId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);