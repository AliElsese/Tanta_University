import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "./models/doctor.schema";
import { DoctorController } from "./controllers/doctor.controller";
import { DoctorService } from "./services/doctor.service";
import { SectionSchema } from "../section/models/section.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Section', schema: SectionSchema }
        ])
    ],
    controllers: [DoctorController],
    providers: [DoctorService]
})

export class DoctorModule {}