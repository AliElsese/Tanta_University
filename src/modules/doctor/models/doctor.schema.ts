import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Doctor extends Document {
    @Prop({ required: [true, 'National ID is required'] })
    nationalId: string;

    @Prop({ required: [true, 'Doctor name is required'] })
    name: string;

    @Prop({ default: '' })
    major: string;

    @Prop({ default: '' })
    profileImageKey?: string;
    
    @Prop({ required: [true, 'Phone number is required'], default: '' })
    phoneNumber: string;

    @Prop({ required: [true, 'Password is required'] })
    passwordHash: string;

    @Prop({ required: [true, 'Email is required'], default: '' })
    email: string;

    @Prop({ required: [true, 'Section is required'], type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);