import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class NewEmployeeDto {
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
    @IsNumber()
    @MinLength(11)
    @MaxLength(11)
    phoneNumber: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}