import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateSectionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @Matches(/^[A-Za-z]{3}$/, { message: 'Slug must be exactly 3 English letters' })
    slug: string;
} 
