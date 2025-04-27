import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class NewDoctorDto {
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
    @IsOptional()
    @IsString()
    @IsAlpha()
    major: string;

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
}