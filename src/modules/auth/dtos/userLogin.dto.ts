import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    userType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    nationalId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}