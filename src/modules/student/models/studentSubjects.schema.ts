import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class StudentSubjects extends Document {
    @Prop({ required: [true, 'Student is required'], type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ required: [true, 'Subject is required'], type: [{ type: Types.ObjectId, ref: 'Subject' }], default: [] })
    subjectIds: Types.ObjectId[];
}

export const StudentSubjectsSchema = SchemaFactory.createForClass(StudentSubjects);