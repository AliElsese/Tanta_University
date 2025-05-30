import { Injectable } from "@nestjs/common";
import { NewDoctorDto } from "../dtos/newDoctor.dto";
import { UpdateDoctorDto } from "../dtos/updateDoctor.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Doctor } from "../models/doctor.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { Section } from "src/modules/section/models/section.schema";
import { Subject } from "src/modules/subject/models/subject.schema";
import { Degree } from "src/modules/degree/models/degree.schema";
import { Grade } from "src/modules/degree/enums/grade.enum";

@Injectable()
export class DoctorService {
    constructor(
        @InjectModel(Doctor.name)
        private DoctorModel: mongoose.Model<Doctor>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        @InjectModel(Degree.name)
        private DegreeModel: mongoose.Model<Degree>,
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addDoctor(doctorDto: NewDoctorDto) {
        const { name, nationalId, major, phoneNumber, email, sectionName } = doctorDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const userExist = await this.DoctorModel.findOne({ 
            $or: [
                { nationalId },
                { email },
                { phoneNumber }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This national ID, email, or phone number already exists.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newDoctor = await this.DoctorModel.create({
            name, nationalId, major, phoneNumber, email,
            passwordHash: hashedPassword,
            sectionId: section._id
        });

        return {
            message: 'Doctor added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getDoctors(name: string) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const doctors = await this.DoctorModel.find({ sectionId: section._id }).select({ _id: 1, name: 1, major: 1, nationalId: 1, phoneNumber: 1, email: 1 });
        
        return {
            message: 'Doctors data.',
            doctors
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getDoctor(doctorId: string) {
        const doctor = await this.DoctorModel.findById({ _id: new mongoose.Types.ObjectId(doctorId) }).select({ _id: 1, name: 1, major: 1, nationalId: 1, phoneNumber: 1, email: 1 });

        if(!doctor) {
            throw new CustomError(404, 'Doctor not found.');
        }

        return {
            message: 'Doctor data.',
            doctor
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateDoctor(doctorId: string, doctorDto: UpdateDoctorDto) {
        const { name, nationalId, major, phoneNumber, email } = doctorDto;

        const currentDoctor = await this.DoctorModel.findById(doctorId);
        if (!currentDoctor) {
            throw new CustomError(404, 'Doctor not found.');
        }

        const doctorExist = await this.DoctorModel.findOne({ 
            $and: [
                {
                    $or: [
                        { nationalId },
                        { email },
                        { phoneNumber }
                    ]
                },
                { sectionId: currentDoctor.sectionId },
                { _id: { $ne: new mongoose.Types.ObjectId(doctorId) } }
            ]
        });
        if(doctorExist) {
            throw new CustomError(400, 'This national ID, email, or phone number already exists in this section.');
        }

        const updatedDoctor = await this.DoctorModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(doctorId) },
            { name, nationalId, major, phoneNumber, email },
            { new: true }
        );

        return {
            message: 'Doctor updated successfully.'
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

    async getDoctorSubjectsStatistics(doctorId: string) {
        const doctor = await this.DoctorModel.findById(new mongoose.Types.ObjectId(doctorId));
        
        const subjects = await this.SubjectModel.find({ doctorId: doctor._id });
        if(!subjects || subjects.length === 0) {
            return {
                message: 'Statistics data.',
                data: {
                    subjectsData: []
                }
            }
        }

        const subjectsData = await Promise.all(subjects.map(async (subject) => {
            return {
                name: subject.name,
                students: {
                    failed: await this.getFailedStudentsNumber(subject._id),
                    pass: await this.getPassStudentsNumber(subject._id),
                    good: await this.getGoodStudentsNumber(subject._id),
                    veryGood: await this.getVeryGoodStudentsNumber(subject._id),
                    excellent: await this.getExcellentStudentsNumber(subject._id),
                }
            };
        }))


        return {
            message: 'Statistics data.',
            data: {
                subjectsData
            }
        }
    }

    async getFailedStudentsNumber(subject: any) {
        const students = await this.DegreeModel.find({ subjectId: new mongoose.Types.ObjectId(subject), grade: Grade.Fail });

        return students.length;
    }

    async getPassStudentsNumber(subject: any) {
        const students = await this.DegreeModel.find({ subjectId: new mongoose.Types.ObjectId(subject), grade: Grade.Pass });

        return students.length;
    }

    async getGoodStudentsNumber(subject: any) {
        const students = await this.DegreeModel.find({ subjectId: new mongoose.Types.ObjectId(subject), grade: Grade.Good });

        return students.length;
    }

    async getVeryGoodStudentsNumber(subject: any) {
        const students = await this.DegreeModel.find({ subjectId: new mongoose.Types.ObjectId(subject), grade: Grade.VeryGood });

        return students.length;
    }

    async getExcellentStudentsNumber(subject: any) {
        const students = await this.DegreeModel.find({ subjectId: new mongoose.Types.ObjectId(subject), grade: Grade.Excellent });

        return students.length;
    }
}