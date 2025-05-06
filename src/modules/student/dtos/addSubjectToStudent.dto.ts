import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class AddSubjectToStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    studentId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    subjectId: string;
}