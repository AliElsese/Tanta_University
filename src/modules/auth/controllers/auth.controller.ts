import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UserLoginDto } from "../dtos/userLogin.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

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
}