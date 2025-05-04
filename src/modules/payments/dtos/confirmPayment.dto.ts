import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class ConfirmPaymentDto {    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    paymentId: string;
}