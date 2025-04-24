import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class NewSubjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hoursNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    highestDegree: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    doctorId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    sectionId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}