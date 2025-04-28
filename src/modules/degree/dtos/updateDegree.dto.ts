import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class UpdateDegreeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subjectDegree: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    subjectId: string;
} 