import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Payment extends Document {
    @Prop({ required: [true, 'Student is required'], type: Types.ObjectId, ref: 'Student' })
    studentId: Types.ObjectId;

    @Prop({ required: [true, 'Yaer is required'], type: Types.ObjectId, ref: 'Year' })
    yearId: Types.ObjectId;

    @Prop({ required: [true, 'Year cost is required'], default: 0 })
    yearCost: Number;

    @Prop({ default: false })
    isPaid: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);