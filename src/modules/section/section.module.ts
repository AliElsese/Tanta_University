import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SectionSchema } from "./models/section.schema";
import { SectionController } from "./controllers/section.controller";
import { SectionService } from "./services/section.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Section', schema: SectionSchema }
        ])
    ],
    controllers: [SectionController],
    providers: [SectionService]
})

export class SectionModule {}