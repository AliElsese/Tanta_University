import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { SubjectTerm } from "../enums/subject.enum";

export class NewSubjectDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
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
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    sectionName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}