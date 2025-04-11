import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewYearDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;
}