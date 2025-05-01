import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DegreeSchema } from "./models/degree.schema";
import { DegreeController } from "./controllers/degree.controller";
import { DegreeService } from "./services/degree.service";
import { SubjectSchema } from "../subject/models/subject.schema";
import { DegreeCalcService } from "src/modules/shared/services/degreeCalc.service";
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Degree', schema: DegreeSchema },
            { name: 'Subject', schema: SubjectSchema }
        ])
    ],
    controllers: [DegreeController],
    providers: [DegreeService, DegreeCalcService]
})

export class DegreeModule {}