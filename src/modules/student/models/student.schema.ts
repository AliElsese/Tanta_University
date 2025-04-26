import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Gender } from "../enums/student.enum";

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

    @Prop({ type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }], default: [] })
    subjectIds: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);