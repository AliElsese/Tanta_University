import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubSectionSchema } from "./models/subsection.schema";
import { SubSectionController } from "./controllers/subsection.controller";
import { SubSectionService } from "./services/subsection.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'SubSection', schema: SubSectionSchema }
        ])
    ],
    controllers: [SubSectionController],
    providers: [SubSectionService]
})

export class SubSectionModule {}