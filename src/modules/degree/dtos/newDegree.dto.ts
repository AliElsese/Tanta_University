import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator";

export class NewDegreeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @MinLength(1)
    @MaxLength(3)
    subjectDegree: Number;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    studentId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    subjectId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}