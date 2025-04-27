import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class Section extends Document {
    @Prop({ required: [true, 'Section name is required'] })
    name: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);