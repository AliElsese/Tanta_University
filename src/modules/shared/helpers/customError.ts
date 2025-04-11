import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomError extends HttpException {
    constructor(statusCode: HttpStatus, message: string) {
        super(
            {
                statusCode: statusCode,
                message: message,
                error: HttpStatus[statusCode] || 'Unknown Error',
            },
            statusCode,
        );
    }
}