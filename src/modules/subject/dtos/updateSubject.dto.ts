import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { SubjectTerm } from "../enums/subject.enum";

export class UpdateSubjectDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(/^[\u0600-\u06FF\sA-Za-z]+$/, { message: 'Name must contain only Arabic or English letters' })
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    code: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    hoursNumber: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    highestDegree: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SubjectTerm, { message: 'Subject Term must be one of the allowed terms.' })
    term: SubjectTerm;
} 