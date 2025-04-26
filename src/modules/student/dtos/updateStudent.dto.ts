import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    nationalId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    universityId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(11)
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email: string;
} 