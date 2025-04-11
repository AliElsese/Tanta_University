import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "./models/doctor.schema";
import { DoctorController } from "./controllers/doctor.controller";
import { DoctorService } from "./services/doctor.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Doctor', schema: DoctorSchema }
        ])
    ],
    controllers: [DoctorController],
    providers: [DoctorService]
})

export class DoctorModule {}