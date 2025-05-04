import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
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
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
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
    @IsString()
    hourCost: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    sectionName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}