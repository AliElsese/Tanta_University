import { Injectable } from "@nestjs/common";
import { NewSubjectDto } from "../dtos/newSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Subject } from "../models/subject.schema";
import mongoose from "mongoose";
import { CustomError } from "src/modules/shared/helpers/customError";
import { PaginationDto } from "src/modules/shared/dtos/pagination.dto";
import { Student } from "src/modules/student/models/student.schema";
import { Section } from "src/modules/section/models/section.schema";
import { Doctor } from "src/modules/doctor/models/doctor.schema";
import { Year } from "src/modules/year/models/year.schema";
import { StudentSubjects } from "src/modules/student/models/studentSubjects.schema";

export interface PopulatedYear {
    name: string;
}

export interface PopulatedDoctor {
    name: string;
}

export interface PopulatedStudent {
    name: string;
    universityId: string;
}

@Injectable()
export class SubjectService {
    constructor(
        @InjectModel(Subject.name)
        private SubjectModel: mongoose.Model<Subject>,

        @InjectModel(Section.name)
        private SectionModel: mongoose.Model<Section>,

        @InjectModel(Student.name)
        private StudentModel: mongoose.Model<Student>,

        @InjectModel(Doctor.name)
        private DoctorModel: mongoose.Model<Doctor>,

        @InjectModel(Year.name)
        private YearModel: mongoose.Model<Year>,

        @InjectModel(StudentSubjects.name)
        private StudentSubjectsModel: mongoose.Model<StudentSubjects>,
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    async addSubject(subjectDto: NewSubjectDto) {
        const { name, code, hoursNumber, highestDegree, term, doctorId, sectionName, yearId } = subjectDto;
        const section = await this.SectionModel.findOne({ name: sectionName });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const doctor = await this.DoctorModel.findById(doctorId);
        if(!doctor) {
            throw new CustomError(404, 'Doctor not found.');
        }
        if(doctor.sectionId.toString() !== section._id.toString()) {
            throw new CustomError(400, 'Doctor does not belong to this section.');
        }

        const year = await this.YearModel.findById(yearId);
        if(!year) {
            throw new CustomError(404, 'Year not found.');
        }
        if(year.sectionId.toString() !== section._id.toString()) {
            throw new CustomError(400, 'Year does not belong to this section.');
        }

        // Check if subject name already exists in the section
        const subjectNameExist = await this.SubjectModel.findOne({ 
            name,
            sectionId: section._id 
        });
        if(subjectNameExist) {
            throw new CustomError(400, 'This subject name already exists in this section.');
        }

        // Check if subject code already exists in the section
        const subjectCodeExist = await this.SubjectModel.findOne({ 
            code,
            sectionId: section._id 
        });
        if(subjectCodeExist) {
            throw new CustomError(400, 'This subject code already exists in this section.');
        }

        const newSubject = await this.SubjectModel.create({
            name, code, hoursNumber, highestDegree, term,
            doctorId: new mongoose.Types.ObjectId(doctorId),
            sectionId: section._id,
            yearId: new mongoose.Types.ObjectId(yearId)
        });

        return {
            message: 'Subject added successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubjects(name: string, paginationDto: PaginationDto) {
        const section = await this.SectionModel.findOne({ name });
        if(!section) {
            throw new CustomError(404, 'Section not found.');
        }

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;
        const subjects = await this.SubjectModel.find({ sectionId: section._id })
            .skip(skip)
            .limit(limit)
            .populate<{ doctorId: PopulatedDoctor }>('doctorId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, doctorId: 1, yearId: 1 });
        
        const newSubjects = subjects.map((subject) => {
            return {
                _id: subject._id,
                name: subject.name,
                code: subject.code,
                hoursNumber: subject.hoursNumber,
                highestDegree: subject.highestDegree,
                doctorName: subject.doctorId.name,
                yearName: subject.yearId.name
            }
        })

        return {
            message: 'Subjects data.',
            newSubjects,
            totalPages: Math.ceil(subjects.length / limit),
            currentPage: page,
            totalSubjects: subjects.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async getSubject(subjectId: string) {
        const subject = await this.SubjectModel.findById({ _id: new mongoose.Types.ObjectId(subjectId) })
            .populate<{ doctorId: PopulatedDoctor }>('doctorId', { _id: 0, name: 1 })
            .populate<{ yearId: PopulatedYear }>('yearId', { _id: 0, name: 1 })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, term: 1, doctorId: 1, yearId: 1 });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        const newSubject = {
            _id: subject._id,
            name: subject.name,
            code: subject.code,
            hoursNumber: subject.hoursNumber,
            highestDegree: subject.highestDegree,
            term: subject.term,
            doctorName: subject.doctorId.name,
            yearName: subject.yearId.name
        }

        return {
            message: 'Subject data.',
            newSubject
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async updateSubject(subjectId: string, subjectDto: UpdateSubjectDto) {
        const { name, code, hoursNumber, highestDegree, term } = subjectDto;

        const currentSubject = await this.SubjectModel.findById(subjectId);
        if (!currentSubject) {
            throw new CustomError(404, 'Subject not found.');
        }

        // Check if name is being updated and if it already exists
        if (name && name !== currentSubject.name) {
            const subjectExist = await this.SubjectModel.findOne({ 
                name,
                sectionId: currentSubject.sectionId,
                _id: { $ne: new mongoose.Types.ObjectId(subjectId) }
            });
            if (subjectExist) {
                throw new CustomError(400, 'This subject name already exists in this section.');
            }
        }

        // Check if code is being updated and if it already exists
        if (code && code !== currentSubject.code) {
            const codeExist = await this.SubjectModel.findOne({ 
                code,
                sectionId: currentSubject.sectionId,
                _id: { $ne: new mongoose.Types.ObjectId(subjectId) }
            });
            if (codeExist) {
                throw new CustomError(400, 'This subject code already exists in this section.');
            }
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (code) updateData.code = code;
        if (hoursNumber) updateData.hoursNumber = hoursNumber;
        if (highestDegree) updateData.highestDegree = highestDegree;
        if (term) updateData.term = term;

        const updatedSubject = await this.SubjectModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(subjectId) },
            updateData,
            { new: true }
        ).select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, term: 1 });

        return {
            message: 'Subject updated successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async removeSubject(subjectId: string) {
        const subject = await this.SubjectModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(subjectId) });

        if(!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        return {
            message: 'Subject deleted successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Add subjects to student
    async addSubjectToStudent(studentId: string, subjectId: string) {
        const student = await this.StudentModel.findByIdAndUpdate(
            { _id: new mongoose.Types.ObjectId(studentId) },
            { $push: { subjectIds: new mongoose.Types.ObjectId(subjectId) } },
            { new: true }
        );

        if(!student) {
            throw new CustomError(404, 'Student not found.');
        }

        return {
            message: 'Subject added to student successfully.'
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Get students enrolled in a subject
    async getSubjectStudents(subjectName: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;

        const subject = await this.SubjectModel.findOne({ name: subjectName });
        if (!subject) {
            throw new CustomError(404, 'Subject not found.');
        }

        // Find students who have this subject in their academicYears array
        const students = await this.StudentSubjectsModel.find({ subjectIds: { $in: [subject._id] } })
            .skip(skip).limit(limit)
            .populate<{ studentId: PopulatedStudent }>('studentId', { _id: 1, name: 1, universityId: 1 })
            .select({ _id: 1, studentId: 1 });

        return {
            message: 'Students enrolled in this subject.',
            students,
            totalPages: Math.ceil(students.length / limit),
            currentPage: page,
            totalStudents: students.length
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Get doctor subjects
    async getDoctorSubjects(doctorId: string) {
        const subjects = await this.SubjectModel.find({ doctorId: new mongoose.Types.ObjectId(doctorId) })
            .select({ _id: 1, name: 1, code: 1, hoursNumber: 1, highestDegree: 1, term: 1, yearId: 1 });
        if (!subjects) {
            throw new CustomError(404, 'Subjects not found.');
        }

        return {
            message: 'Doctor subjects.',
            subjects
        }
    }
}