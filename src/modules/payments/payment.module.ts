import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentSchema } from "./models/payment.schema";
import { PaymentController } from "./controllers/payment.controller";
import { PaymentService } from "./services/payment.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Payment', schema: PaymentSchema }
        ])
    ],
    controllers: [PaymentController],
    providers: [PaymentService]
})

export class PaymentModule {}