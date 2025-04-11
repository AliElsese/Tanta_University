import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
    constructor(
        private JwtService: JwtService
    ) {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    async generateAccessToken(payload: any) {
        const accessToken = this.JwtService.sign(payload, { expiresIn: '10m' });
        return accessToken;
    }
}
