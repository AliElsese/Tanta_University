import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { SubjectTerm } from "../enums/subject.enum";

export class NewSubjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hoursNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    highestDegree: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(SubjectTerm, { message: 'Subject Term must be one of the allowed terms.' })
    term: SubjectTerm;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    doctorId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    sectionId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}