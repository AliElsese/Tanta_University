import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubjectSchema } from "./models/subject.schema";
import { SubjectController } from "./controllers/subject.controller";
import { SubjectService } from "./services/subject.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Subject', schema: SubjectSchema }
        ])
    ],
    controllers: [SubjectController],
    providers: [SubjectService]
})

export class SubjectModule {}