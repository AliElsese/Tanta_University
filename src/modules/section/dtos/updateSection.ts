import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class UpdateSectionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    @MaxLength(50)
    name: string;
} 