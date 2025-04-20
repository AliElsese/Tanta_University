import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class SubjectDegreesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    subjectId: string;
}