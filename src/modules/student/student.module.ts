import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentSchema } from "./models/student.schema";
import { StudentController } from "./controllers/student.controller";
import { StudentService } from "./services/student.service";
import { SectionSchema } from "../section/models/section.schema";
import { SubjectSchema } from "../subject/models/subject.schema";
import { StudentSubjectsSchema } from "./models/studentSubjects.schema";
import { PaymentSchema } from "../payments/models/payment.schema";
import { DegreeSchema } from "../degree/models/degree.schema";
import { DoctorSchema } from "../doctor/models/doctor.schema";
import { YearSchema } from "../year/models/year.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Student', schema: StudentSchema },
            { name: 'StudentSubjects', schema: StudentSubjectsSchema },
            { name: 'Section', schema: SectionSchema },
            { name: 'Subject', schema: SubjectSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'Degree', schema: DegreeSchema },
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Year', schema: YearSchema }
        ])
    ],
    controllers: [StudentController],
    providers: [StudentService]
})

export class StudentModule {}