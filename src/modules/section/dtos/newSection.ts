import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewSectionDto {t
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}