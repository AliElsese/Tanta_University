import { Injectable } from "@nestjs/common";
import { NewStudentDto } from "../dtos/newStudent.dto";
import { UpdateStudentDto } from "../dtos/updateStudent.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Student } from "../models/student.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import * as bcrypt from 'bcrypt';
import { Section } from "src/modules/section/models/section.schema";
import { Subject } from "src/modules/subject/models/subject.schema";
import { StudentSubjects } from "../models/studentSubjects.schema";
import { Payment } from "src/modules/payments/models/payment.schema";
import { Degree } from "src/modules/degree/models/degree.schema";
import { AddSubjectToStudentDto } from "../dtos/addSubjectToStudent.dto";

export interface PopulatedYear {
    _id: mongoose.Types.ObjectId;
    name: string;
}

export interface PopulatedSubject {
    name: string;
    hoursNumber: string;
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
        private PaymentModel: mongoose.Model<Payment>,

        @InjectModel(Degree.name)
        private DegreeModel: mongoose.Model<Degree>
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

        const studentSubjects = subjects.map(subject => (
            {
                studentId: newStudent._id,
                yearId: new mongoose.Types.ObjectId(yearId),
                subjectId: subject._id
            }
        ));
        await this.StudentSubjectsModel.insertMany(studentSubjects);

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

    async getStudents(name: string) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const students = await this.StudentModel.find({ sectionId: section._id })
            .populate<{ yearIds: PopulatedYear[] }>('yearIds', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, hourCost: 1, yearIds: 1 });
        
        const newStudents = students.map((student) => {
            return {
                _id: student._id,
                name: student.name,
                nationalId: student.nationalId,
                gender: student.gender,
                universityId: student.universityId,
                phoneNumber: student.phoneNumber,
                email: student.email,
                hourCost: student.hourCost,
                yearName: student.yearIds[student.yearIds.length - 1]?.name || ''
            }
        })

        return {
            message: 'Students data.',
            newStudents
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getStudent(studentId: string) {
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) })
            .select({ _id: 1, name: 1, nationalId: 1, gender: 1, universityId: 1, phoneNumber: 1, email: 1, hourCost: 1 });

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
            email: student.email,
            hourCost: student.hourCost
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

        const studentSubjects = await this.StudentSubjectsModel.deleteMany({ studentId: new mongoose.Types.ObjectId(studentId) });
        const studentDegrees = await this.DegreeModel.deleteMany({ studentId: new mongoose.Types.ObjectId(studentId) });
        const studentPayments = await this.PaymentModel.deleteMany({ studentId: new mongoose.Types.ObjectId(studentId) });

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
        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) });
        if (!student) {
            throw new CustomError(404, 'Student not found.');
        }

        const subjects = await this.StudentSubjectsModel.find({ studentId: student._id, yearId: new mongoose.Types.ObjectId(yearId) })
            .populate<{ subjectId: PopulatedSubject }>({path: 'subjectId',
                select: '_id name code hoursNumber highestDegree term doctorId',
                populate: {
                    path: 'doctorId',
                    select: '_id name email' // whatever fields you need from the doctor
                }
            });

        return {
            message: 'Student subjects retrieved successfully.',
            subjects
        };
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Add subjects to student
    async addSubjectToStudent(studentDto: AddSubjectToStudentDto) {
        const { studentId, subjectId } = studentDto;

        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) });
        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) });
        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        const studentpayment = await this.PaymentModel.findOne(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId }
        );
        if(studentpayment.isPaid) {
            throw new CustomError(400, 'لا يمكن تسجيل الماده بعد دفع المصاريف.');
        }

        const subjectEnrolled = await this.StudentSubjectsModel.create(
            {
                studentId: new mongoose.Types.ObjectId(studentId),
                yearId: subject.yearId,
                subjectId: subject._id
            }
        );

        const newStudentSubjects = await this.StudentSubjectsModel.find(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId  }
        ).populate<{ subjectId: PopulatedSubject }>('subjectId', { _id: 1, name: 1, hoursNumber: 1 });;

        if(newStudentSubjects.length !== 0) {
            let totalHours = 0;
            newStudentSubjects.forEach(subject => {
                totalHours += Number(subject.subjectId.hoursNumber)
            })
            const yearCost: Number = Number(student.hourCost) * totalHours;

            await this.PaymentModel.findOneAndUpdate(
                { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId },
                { yearCost },
                { new: true }
            )
        }

        return {
            message: 'Subject added to student successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSubjectFromStudent(studentId: string, subjectId: string) {
        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) });
        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const student = await this.StudentModel.findById({ _id: new mongoose.Types.ObjectId(studentId) });
        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        const studentpayment = await this.PaymentModel.findOne(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId }
        );
        if(studentpayment.isPaid) {
            throw new CustomError(400, 'لا يمكن الغاء تسجيل الماده بعد دفع المصاريف.');
        }

        const studentSubjects = await this.StudentSubjectsModel.findOneAndDelete(
            {
                studentId: new mongoose.Types.ObjectId(studentId),
                subjectId: new mongoose.Types.ObjectId(subjectId),
                yearId: subject.yearId
            }
        );

        const studentDegrees = await this.DegreeModel.findOneAndDelete(
            { studentId: new mongoose.Types.ObjectId(studentId), subjectId: new mongoose.Types.ObjectId(subjectId) }
        );

        const newStudentSubjects = await this.StudentSubjectsModel.find(
            { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId  }
        ).populate<{ subjectId: PopulatedSubject }>('subjectId', { _id: 1, name: 1, hoursNumber: 1 });;

        if(newStudentSubjects.length !== 0) {
            let totalHours = 0;
            newStudentSubjects.forEach(subject => {
                totalHours += Number(subject.subjectId.hoursNumber)
            })
            const yearCost: Number = Number(student.hourCost) * totalHours;

            await this.PaymentModel.findOneAndUpdate(
                { studentId: new mongoose.Types.ObjectId(studentId), yearId: subject.yearId },
                { yearCost },
                { new: true }
            )
        }

        return {
            message: 'Subject removed successfully.'
        }
    }
}