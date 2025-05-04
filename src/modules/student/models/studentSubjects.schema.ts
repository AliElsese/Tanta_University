import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { SubjectTerm } from "src/modules/subject/enums/subject.enum";

@Schema({
    timestamps: true
})

export class StudentSubjects extends Document {
    @Prop({ required: [true, 'Student is required'], type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ required: [true, 'Year is required'], type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;

    // @Prop({ required: [true, 'Term is required'], enum: SubjectTerm })
    // term: SubjectTerm;

    @Prop({ required: [true, 'Subject is required'], type: [{ type: Types.ObjectId, ref: 'Subject' }], default: [] })
    subjectIds: Types.ObjectId[];
}

export const StudentSubjectsSchema = SchemaFactory.createForClass(StudentSubjects);