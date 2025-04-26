import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateSectionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;
} 