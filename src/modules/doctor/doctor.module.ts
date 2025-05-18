import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorSchema } from "./models/doctor.schema";
import { DoctorController } from "./controllers/doctor.controller";
import { DoctorService } from "./services/doctor.service";
import { SectionSchema } from "../section/models/section.schema";
import { SubjectSchema } from "../subject/models/subject.schema";
import { DegreeSchema } from "../degree/models/degree.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Doctor', schema: DoctorSchema },
            { name: 'Section', schema: SectionSchema },
            { name: 'Subject', schema: SubjectSchema },
            { name: 'Degree', schema: DegreeSchema },
        ])
    ],
    controllers: [DoctorController],
    providers: [DoctorService]
})

export class DoctorModule {}