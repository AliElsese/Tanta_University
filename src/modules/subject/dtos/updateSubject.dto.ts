import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateSubjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;
} 