import { Module } from "@nestjs/common";
import { JWTService } from "../shared/services/jwt.service";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "../doctor/models/doctor.schema";
import { EmployeeSchema } from "../employee/models/employee.schema";
import { StudentSchema } from "../student/models/student.schema";
import { AuthController } from "./controllers/auth.controller";
import { EmployeeService } from "../employee/services/employee.service";
import { DoctorService } from "../doctor/services/doctor.service";
import { StudentService } from "../student/services/student.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Employee', schema: EmployeeSchema },
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Student', schema: StudentSchema }
        ])
    ],
    controllers: [AuthController],
    providers: [JWTService, AuthService, EmployeeService, DoctorService, StudentService]
})

export class AuthModule {}