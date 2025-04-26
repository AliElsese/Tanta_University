import { Injectable } from "@nestjs/common";
import { NewDoctorDto } from "../dtos/newDoctor.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Doctor } from "../models/doctor.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";

@Injectable()
export class DoctorService {
    constructor(
        @InjectModel(Doctor.name)
        private DoctorModel: mongoose.Model<Doctor> 
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addDoctor(doctorDto: NewDoctorDto) {
        const { name, nationalId, major, phoneNumber, email } = doctorDto;

        const userExist = await this.DoctorModel.findOne({ 
            $or: [
                { nationalId },
                { email }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This user already exist.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newDoctor = await this.DoctorModel.create({
            name, nationalId, major, phoneNumber, email,
            passwordHash: hashedPassword
        });

        return {
            message: 'Doctor added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getDoctors(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const doctors = await this.DoctorModel.find({ }).skip(skip).limit(limit).select({ _id: 1, name: 1, nationalId: 1, phoneNumber: 1, email: 1 });
        
        return {
            message: 'Doctors data.',
            doctors,
            totalPages: Math.ceil(doctors.length / limit),
            currentPage: page,
            totalDoctors: doctors.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getDoctor(doctorId: string) {
        const doctor = await this.DoctorModel.findById({ _id: new mongoose.Types.ObjectId(doctorId) }).select({ _id: 1, name: 1, nationalId: 1, phoneNumber: 1, email: 1 });

        if(!doctor) {
            throw new CustomError(404, 'Doctor not found.');
        }

        return {
            message: 'Doctor data.',
            doctor
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeDoctor(doctorId: string) {
        const doctor = await this.DoctorModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(doctorId) });

        if(!doctor) {
            throw new CustomError(404, 'Doctor not found.');
        }

        return {
            message: 'Doctor deleted successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateDoctor(doctorId: string, updateData: Partial<NewDoctorDto>) {
        const { nationalId, email } = updateData;

        // Check if the doctor exists
        const existingDoctor = await this.DoctorModel.findById(doctorId);
        if (!existingDoctor) {
            throw new CustomError(404, 'Doctor not found.');
        }

        // If nationalId or email is being updated, check for duplicates
        if (nationalId || email) {
            const duplicateDoctor = await this.DoctorModel.findOne({
                $or: [
                    { nationalId: nationalId || existingDoctor.nationalId },
                    { email: email || existingDoctor.email }
                ],
                _id: { $ne: doctorId } // Exclude the current doctor from the check
            });

            if (duplicateDoctor) {
                throw new CustomError(400, 'A doctor with this national ID or email already exists.');
            }
        }

        const updatedDoctor = await this.DoctorModel.findByIdAndUpdate(
            doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return {
            message: 'Doctor updated successfully.',
            doctor: updatedDoctor
        };
    }
}