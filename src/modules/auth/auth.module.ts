import { Module } from "@nestjs/common";
import { JWTService } from "../shared/services/jwt.service";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "../doctor/models/doctor.schema";
import { EmployeeSchema } from "../employee/models/employee.schema";
import { StudentSchema } from "../student/models/student.schema";
import { AuthController } from "./controllers/auth.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Employee', schema: EmployeeSchema },
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Student', schema: StudentSchema }
        ])
    ],
    controllers: [AuthController],
    providers: [JWTService, AuthService]
})

export class AuthModule {}