import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentSchema } from "./models/student.schema";
import { StudentController } from "./controllers/student.controller";
import { StudentService } from "./services/student.service";
import { SectionSchema } from "../section/models/section.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Student', schema: StudentSchema },
            { name: 'Section', schema: SectionSchema }
        ])
    ],
    controllers: [StudentController],
    providers: [StudentService]
})

export class StudentModule {}