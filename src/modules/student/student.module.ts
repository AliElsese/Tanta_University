import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentSchema } from "./models/student.schema";
import { StudentController } from "./controllers/student.controller";
import { StudentService } from "./services/student.service";
import { SectionSchema } from "../section/models/section.schema";
import { SubjectSchema } from "../subject/models/subject.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Student', schema: StudentSchema },
            { name: 'Section', schema: SectionSchema },
            { name: 'Subject', schema: SubjectSchema }
        ])
    ],
    controllers: [StudentController],
    providers: [StudentService]
})

export class StudentModule {}