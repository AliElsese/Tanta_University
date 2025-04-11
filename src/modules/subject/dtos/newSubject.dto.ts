import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class NewSubjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @MinLength(11)
    @MaxLength(11)
    code: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    hoursNumber: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    highestDegree: Number;

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