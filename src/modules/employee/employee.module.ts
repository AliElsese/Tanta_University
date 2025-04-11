import { Module } from "@nestjs/common";
import { EmployeeController } from "./controllers/employee.controller";
import { EmployeeService } from "./services/employee.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EmployeeSchema } from "./models/employee.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Employee', schema: EmployeeSchema }
        ])
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService]
})

export class EmployeeModule {}