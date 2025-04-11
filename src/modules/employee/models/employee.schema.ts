import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class Employee extends Document {
    @Prop({ required: [true, 'National ID is required'] })
    nationalId: string;

    @Prop({ required: [true, 'Employee name is required'] })
    name: string;

    @Prop({ default: '' })
    profileImageKey?: string;
    
    @Prop({ required: [true, 'Employee name is required'], default: '' })
    phoneNumber: string;

    @Prop({ required: [true, 'Password is required'] })
    passwordHash: string;

    @Prop({ default: '' })
    email: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);