import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class StudentYearDegreesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    studentId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    yearId: string;
}