import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/roles.enum';
import { CustomError } from '../helpers/customError';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new CustomError(401, 'No token provided');
        }

        try {
            const token = this.extractToken(authHeader);
            
            const tokenPayload = this.verifyToken(token);
            
            request.user = tokenPayload;
            const userRole = tokenPayload.role;

            if (!userRole || !Object.values(UserRole).includes(userRole)) {
                throw new CustomError(403, 'Invalid user role');
            }

            const hasRequiredRole = requiredRoles.some((role) => userRole === role);

            if (!hasRequiredRole) {
                throw new CustomError(403, 'Forbidden resource');
            }

            return true;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(401, 'Invalid token');
        }
    }

    private extractToken(authHeader: string): string {
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new CustomError(401, 'Invalid authorization header format');
        }
        return parts[1];
    }

    private verifyToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new CustomError(401, 'Invalid or expired token');
        }
    }
} 