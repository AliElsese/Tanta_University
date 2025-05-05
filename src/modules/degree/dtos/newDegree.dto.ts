import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class StudentDegreeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    studentId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subjectDegree: string;
}

export class NewDegreeDto {
    @ApiProperty({ type: [StudentDegreeDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudentDegreeDto)
    studentDegrees: StudentDegreeDto[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subjectName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    highestDegree: string;
}