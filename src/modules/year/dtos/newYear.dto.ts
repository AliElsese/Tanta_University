import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewYearDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    sectionId: string;
}