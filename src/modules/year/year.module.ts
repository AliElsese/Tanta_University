import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { YearSchema } from "./models/year.schema";
import { YearController } from "./controllers/year.controller";
import { YearService } from "./services/year.service";
import { SectionSchema } from "../section/models/section.schema";
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Year', schema: YearSchema },
            { name: 'Section', schema: SectionSchema }
        ])
    ],
    controllers: [YearController],
    providers: [YearService]
})

export class YearModule {}