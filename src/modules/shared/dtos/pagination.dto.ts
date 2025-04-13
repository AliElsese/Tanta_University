import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsPositive()
    page?: number = 1;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number = 10;
}