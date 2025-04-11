import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Gender } from "../enums/student.enum";

export class NewStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(14)
    nationalId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Gender, { message: 'Student type must be one of the allowed genders.' })
    gender: Gender;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    universityId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @MinLength(11)
    @MaxLength(11)
    phoneNumber: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(100)
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    sectionId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}