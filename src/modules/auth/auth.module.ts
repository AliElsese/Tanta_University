import { Module } from "@nestjs/common";
import { JWTService } from "../shared/services/jwt.service";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "../doctor/models/doctor.schema";
import { EmployeeSchema } from "../employee/models/employee.schema";
import { StudentSchema } from "../student/models/student.schema";
import { SectionSchema } from "../section/models/section.schema";
import { SubjectSchema } from "../subject/models/subject.schema";
import { DegreeSchema } from "../degree/models/degree.schema";
import { AuthController } from "./controllers/auth.controller";
import { EmployeeService } from "../employee/services/employee.service";
import { DoctorService } from "../doctor/services/doctor.service";
import { StudentService } from "../student/services/student.service";
import { StudentSubjectsSchema } from "../student/models/studentSubjects.schema";
import { PaymentSchema } from "../payments/models/payment.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Employee', schema: EmployeeSchema },
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Student', schema: StudentSchema },
            { name: 'StudentSubjects', schema: StudentSubjectsSchema },
            { name: 'Section', schema: SectionSchema },
            { name: 'Subject', schema: SubjectSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'Degree', schema: DegreeSchema }
        ]),
    ],
    controllers: [AuthController],
    providers: [JWTService, AuthService, EmployeeService, DoctorService, StudentService]
})

export class AuthModule {}