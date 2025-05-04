import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "../models/payment.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";

export interface PopulatedYear {
    name: string;
}

export interface PopulatedStudent {
    name: string;
}

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name)
        private PaymentModel: mongoose.Model<Payment>,
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudentYearPayment(studentId: string, yearId: string) {
        const payment = await this.PaymentModel.findOne({ studentId: new mongoose.Types.ObjectId(studentId), yearId: new mongoose.Types.ObjectId(yearId) }).select({ _id: 1, yearCost: 1, isPaid: 1});
    
        if(!payment) {
            throw new CustomError(404, 'Student payment not found.');
        }

        return {
            message: 'Student year cost',
            payment
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudentPayments(studentId: string) {
        const payments = await this.PaymentModel.findOne({ studentId: new mongoose.Types.ObjectId(studentId) })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, yearId: 1, yearCost: 1, isPaid: 1 });
    
        if(!payments) {
            throw new CustomError(404, 'Student payment not found.');
        }

        return {
            message: 'Student year cost',
            payments
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getYearPayments(yearId: string) {
        const payments = await this.PaymentModel.findOne({ yearId: new mongoose.Types.ObjectId(yearId) })
            .populate<{ studentId: PopulatedStudent }>('studentId', { _id: 0, name: 1 })
            .select({ _id: 1, studentId: 1, yearCost: 1, isPaid: 1 });
    
        if(!payments) {
            throw new CustomError(404, 'Student payment not found.');
        }

        return {
            message: 'Student year cost',
            payments
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async confirmStudentPayment(paymentId: string) {
        const payment = await this.PaymentModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(paymentId) },
            { isPaid: true },
            { new: true }
        )
    
        if(!payment) {
            throw new CustomError(404, 'Student payment not found.');
        }

        return {
            message: 'Student year payment confirmed'
        }
    }
}