import { Body, Controller, Get, Post, UseGuards, Headers } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UserLoginDto } from "../dtos/userLogin.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/modules/shared/guards/roles.guard";
import { Roles } from "src/modules/shared/decorators/roles.decorator";
import { UserRole } from "src/modules/shared/enums/roles.enum";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////

    @Post('userLogin')
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ description: 'Login inputs', type: UserLoginDto })
    @ApiResponse({ status: 200, description: 'User login successfully' })
    async login(@Body() doctorDto: UserLoginDto) {
        return this.AuthService.userLogin(doctorDto);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles(UserRole.EMPLOYEE, UserRole.DOCTOR, UserRole.STUDENT)
    @Get('userData')
    @ApiOperation({ summary: 'User data' })
    @ApiResponse({ status: 200, description: 'User data' })
    async getUserInfo(@Headers('authorization') token: string) {
        return this.AuthService.userData(token);
    }
}