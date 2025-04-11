import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class Year extends Document {
    @Prop({ required: [true, 'Year name is required'] })
    name: string;
}

export const YearSchema = SchemaFactory.createForClass(Year);