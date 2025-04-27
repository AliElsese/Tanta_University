import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Gender } from "../enums/student.enum";

export class NewStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(14)
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
    @IsString()
    universityId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    sectionId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}