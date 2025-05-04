import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubjectSchema } from "./models/subject.schema";
import { SubjectController } from "./controllers/subject.controller";
import { SubjectService } from "./services/subject.service";
import { StudentSchema } from "../student/models/student.schema";
import { SectionSchema } from "../section/models/section.schema";
import { DoctorSchema } from "../doctor/models/doctor.schema";
import { YearSchema } from "../year/models/year.schema";
import { StudentSubjectsSchema } from "../student/models/studentSubjects.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Subject', schema: SubjectSchema },
            { name: 'Section', schema: SectionSchema },
            { name: 'Student', schema: StudentSchema },
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Year', schema: YearSchema },
            { name: 'StudentSubjects', schema: StudentSubjectsSchema }
        ])
    ],
    controllers: [SubjectController],
    providers: [SubjectService]
})

export class SubjectModule {}