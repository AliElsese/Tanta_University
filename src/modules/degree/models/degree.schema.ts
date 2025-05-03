import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Grade } from "../enums/grade.enum";
import { SubjectTerm } from "src/modules/subject/enums/subject.enum";

interface SubjectsDegrees {
    subjectId: Types.ObjectId;
    subjectDegree: Number;
    GBA: Number,
    grade: Grade
}

@Schema({
    timestamps: true
})

export class Degree extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;

    @Prop({ required: [true, 'Academic years are required'], type: [{
        subjectId: { type: Types.ObjectId, ref: 'Subject' },
        subjectDegree: { type: Number, default: 0 },
        GBA: { type: Number, default: 0 },
        grade: { type: String, enum: Grade, default: Grade.Fail }
    }], default: [] })
    subjectsDegrees: SubjectsDegrees[];

    @Prop({ required: [true, 'GBA is required'], default: 0 })
    GBA: Number;

    @Prop({ required: [true, 'Grade is required'], enum: Grade, default: Grade.Fail })
    grade: Grade;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);