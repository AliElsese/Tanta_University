import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { UpdateStudentDto } from "../dtos/updateStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Section } from "src/modules/section/models/section.schema";
import { Subject } from "src/modules/subject/models/subject.schema";
import { Degree } from "src/modules/degree/models/degree.schema";
import { StudentSubjects } from "../models/studentSubjects.schema";
import { Payment } from "src/modules/payments/models/payment.schema";

export interface PopulatedYear {
    _id: mongoose.Types.ObjectId;
    name: string;
}

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>,

        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        @InjectModel(StudentSubjects.name)
        private StudentSubjectsModel: mongoose.Model<StudentSubjects>,

        @InjectModel(Payment.name)
        private PaymentModel: mongoose.Model<Payment>
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addStudent(studentDto: NewStudentDto) {
        const { name, nationalId, gender, universityId, phoneNumber, email, hourCost, sectionName, yearId } = studentDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const userExist = await this.StudentModel.findOne({
            $or: [
                { nationalId },
                { universityId },
                { email },
                { phoneNumber }
            ]
        });
        if(userExist) {
            throw new CustomError(400, 'This national ID, email, university ID or phone number already exists.');
        }

        const hashedPassword = await bcrypt.hash('123456', 12);

        const newStudent = await this.StudentModel.create({
            name, nationalId, gender, universityId,
            passwordHash: hashedPassword,
            phoneNumber, email, hourCost: Number(hourCost),
            sectionId: section._id,
            yearIds: [new mongoose.Types.ObjectId(yearId)]
        });

        const subjects = await this.SubjectModel.find({ yearId: new mongoose.Types.ObjectId(yearId) }).select({ _id: 1, hoursNumber: 1 });

        const subjectIds = subjects.map(subject => (
            subject._id
        ));
        await this.StudentSubjectsModel.create({ studentId: newStudent._id, yearId: new mongoose.Types.ObjectId(yearId), subjectIds: subjectIds });

        if(subjects.length !== 0) {
            let totalHours = 0;
            subjects.forEach(subject => {
                totalHours += Number(subject.hoursNumber)
            })
            const yearCost: Number = Number(hourCost) * totalHours;

            await this.PaymentModel.create({
                studentId: newStudent._id,
                yearId: new mongoose.Types.ObjectId(yearId),
                yearCost
            })
        }

        return {
            message: 'Student added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudents(name: string, paginationDto: PaginationDto) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const students = await this.StudentModel.find({ sectionId: section._id })
            .skip(skip)
            .limit(limit)
            .populate<{ yearIds: PopulatedYear[] }>('yearIds', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, yearIds: 1 });
        
        const newStudents = students.map((student) => {
            return {
                _id: student._id,
                name: student.name,
                nationalId: student.nationalId,
                gender: student.gender,
                universityId: student.universityId,
                phoneNumber: student.phoneNumber,
                email: student.email,
                yearName: student.yearIds[student.yearIds.length - 1]?.name || ''
            }
        })

        return {
            message: 'Students data.',
            newStudents,
            totalPages: Math.ceil(students.length / limit),
            currentPage: page,
            totalStudents: students.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudent(studentId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1 });

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        const newStudent = {
            _id: student._id,
            name: student.name,
            nationalId: student.nationalId,
            gender: student.gender,
            universityId: student.universityId,
            phoneNumber: student.phoneNumber,
            email: student.email
        }

        return {
            message: 'Student data.',
            newStudent
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateStudent(studentId: string, studentDto: UpdateStudentDto) {
        const { name, nationalId, universityId, phoneNumber, email, hourCost } = studentDto;

        const currentStudent = await this.StudentModel.findById(studentId);
        if (!currentStudent) {
            throw new CustomError(404, 'Student not found.');
        }

        const studentExist = await this.StudentModel.findOne({ 
            $and: [
                {
                    $or: [
                        { nationalId },
                        { email },
                        { universityId },
                        { phoneNumber }
                    ]
                },
                { sectionId: currentStudent.sectionId },
                { _id: { $ne: new mongoose.Types.ObjectId(studentId) } }
            ]
        });
        if(studentExist) {
            throw new CustomError(400, 'This national ID, email, or phone number already exists in this section.');
        }

        const updatedStudent = await this.StudentModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(studentId) },
            { name, nationalId, universityId, phoneNumber, email, hourCost: Number(hourCost) },
            { new: true }
        ).select({ _id: 1, name: 1, nationalId: 1, universityId: 1, phoneNumber: 1, email: 1 });

        if(!updatedStudent) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Student updated successfully.'
        }
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////

    async removeStudent(studentId: string) {
        const student = await this.StudentModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(studentId) });

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        // const studentDegrees = await this.DegreeModel.findOneAndDelete({ studentId: new mongoose.Types.ObjectId(studentId) });

        return {
            message: 'Student deleted successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudentYears(studentId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) })
            .populate<{ yearIds: PopulatedYear[] }>('yearIds', { _id: 1, name: 1 });
        
        if (!student) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Student years retrieved successfully.',
            years: student.yearIds.map(year => ({
                id: year._id,
                name: year.name
            }))
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudentSubjectsByYear(studentId: string, yearId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) })
            .populate<{ academicYears: Array<{
                yearId: PopulatedYear;
                term: string;
                subjectsIds: Array<{
                    _id: mongoose.Types.ObjectId;
                    name: string;
                }>;
            }> }>('academicYears.subjectsIds', { _id: 1, name: 1 })
            .populate('academicYears.yearId', { _id: 1, name: 1 });

        if (!student) {
            throw new CustomError(404, 'Student not found.');
        }

        // Filter academic years for the specified year
        const yearSubjects = student.academicYears
            .filter(academicYear => academicYear.yearId._id.toString() === yearId)
            .map(academicYear => ({
                term: academicYear.term,
                subjects: academicYear.subjectsIds.map(subject => ({
                    id: subject._id.toString(),
                    name: subject.name
                }))
            }));

        return {
            message: 'Student subjects retrieved successfully.',
            yearSubjects
        };
    }

    //////////////////////////////////////////////////////////////////////////////////////////
}