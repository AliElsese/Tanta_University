import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomError } from '../helpers/customError';

@Injectable()
export class JWTService {
    constructor(
        private JwtService: JwtService
    ) {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    async generateAccessToken(payload: any) {
        const accessToken = this.JwtService.sign(payload, { expiresIn: '20m' });
        return accessToken;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    async verifyToken(token: string) {
        const parts = token.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new CustomError(401, 'Invalid authorization header format');
        }
        const tokenPayload = this.JwtService.verify(parts[1]);
        return tokenPayload;
    }
}
