import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";
import { ConfirmPaymentDto } from "../dtos/confirmPayment.dto";

@Controller('payment')
@ApiTags('payment')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class PaymentController {
    constructor(
        private PaymentService: PaymentService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE, UserRole.STUDENT)
    @Get('getStudentYearCost/:studentId/:yearId')
    @ApiOperation({ summary: 'Get student year cost' })
    @ApiParam({ name: 'studentId', required: true, description: 'The ID of the student' })
    @ApiParam({ name: 'yearId', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Student year cost retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getStudentYearCost(
        @Param('studentId') studentId: string,
        @Param('yearId') yearId: string
    ) {
        return this.PaymentService.getStudentYearPayment(studentId, yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE, UserRole.STUDENT)
    @Get('getStudentYearsCost/:studentId')
    @ApiOperation({ summary: 'Get student years cost' })
    @ApiParam({ name: 'studentId', required: true, description: 'The ID of the student' })
    @ApiResponse({ status: 200, description: 'Student years cost retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getStudentYearsCost(@Param('studentId') studentId: string) {
        return this.PaymentService.getStudentPayments(studentId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Get('getStudentsYearCost/:yearId')
    @ApiOperation({ summary: 'Get students year cost' })
    @ApiParam({ name: 'yearId', required: true, description: 'The ID of the year' })
    @ApiResponse({ status: 200, description: 'Students year cost retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async getStudentsYearCost(@Param('yearId') yearId: string) {
        return this.PaymentService.getYearPayments(yearId);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    @Roles(UserRole.EMPLOYEE)
    @Post('confirmPayment')
    @ApiOperation({ summary: 'Confirm student year payment' })
    @ApiBody({ description: 'Student update payment', type: ConfirmPaymentDto })
    @ApiResponse({ status: 200, description: 'Student payment confirmed' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        schema: {
            type: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    })
    async confirmPayment(@Body() paymentDto: ConfirmPaymentDto) {
        return this.PaymentService.confirmStudentPayment(paymentDto);
    }
}