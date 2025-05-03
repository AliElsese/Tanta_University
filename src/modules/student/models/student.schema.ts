import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Gender } from "../enums/student.enum";
import { SubjectTerm } from "src/modules/subject/enums/subject.enum";
import { Grade } from "src/modules/degree/enums/grade.enum";

interface AcademicYear {
    yearId: Types.ObjectId;
    term: string;
    subjectsIds: Types.ObjectId[];
}

@Schema({
    timestamps: true
})

export class Student extends Document {
    @Prop({ required: [true, 'National ID is required'] })
    nationalId: string;

    @Prop({ required: [true, 'Student name is required'] })
    name: string;

    @Prop({ required: [true, 'Gender is required'], enum: Gender })
    gender: Gender;

    @Prop({ required: [true, 'Student University ID is required'] })
    universityId: string;
    
    @Prop({ default: '' })
    profileImageKey?: string;
        
    @Prop({ default: '' })
    phoneNumber: string;
    
    @Prop({ required: [true, 'Password is required'] })
    passwordHash: string;

    @Prop({ required: [true, 'Email is required'], default: '' })
    email: string;

    @Prop({ required: [true, 'Section is required'], type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;

    @Prop({ required: [true, 'Year is required'], type: [{ type: Types.ObjectId, ref: 'Year' }], default: [] })
    yearIds: Types.ObjectId[];

    @Prop({ required: [true, 'Academic years are required'], type: [{
        yearId: { type: Types.ObjectId, ref: 'Year' },
        term: { type: String, enum: SubjectTerm },
        subjectsIds: [{ type: Types.ObjectId, ref: 'Subject' }],
        GBA: Number,
        grade: { type: String, enum: Grade }
    }], default: [] })
    academicYears: AcademicYear[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);