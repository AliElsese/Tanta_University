import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Section extends Document {
    @Prop({ required: [true, 'Section name is required'] })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;
}

export const SectionSchema = SchemaFactory.createForClass(Section);