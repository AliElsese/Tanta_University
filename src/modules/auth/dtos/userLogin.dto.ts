import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UserLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    userType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(14)
    nationalId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}