import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class Doctor extends Document {
    @Prop({ required: [true, 'National ID is required'] })
    nationalId: string;

    @Prop({ required: [true, 'Doctor name is required'] })
    name: string;

    @Prop({ required: [true, 'Major is required'] })
    major: string;

    @Prop({ default: '' })
    profileImageKey?: string;
    
    @Prop({ default: '' })
    phoneNumber: string;

    @Prop({ required: [true, 'Password is required'] })
    passwordHash: string;

    @Prop({ default: '' })
    email: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);