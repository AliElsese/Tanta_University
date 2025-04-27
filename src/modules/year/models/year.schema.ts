import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Year extends Document {
    @Prop({ required: [true, 'Year name is required'] })
    name: string;

    @Prop({ required: [true, 'Section is required'], type: Types.ObjectId, ref: 'Section' })
    sectionId: Types.ObjectId;
}

export const YearSchema = SchemaFactory.createForClass(Year);