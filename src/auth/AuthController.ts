import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthForgetDto } from './dto/auth-forget-dto';
import { AuthLoginDto } from './dto/auth-login-dto';
import { AuthRegisterDto } from './dto/auth-register-dto';
import { AuthResetDto } from './dto/auth-reset-dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('login')
    async login(@Body() { email, senha }: AuthLoginDto) {
        return this.authService.login(email, senha);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDto) {
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDto) {
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { senha, token }: AuthResetDto) {
        return this.authService.reset(senha, token);
    }

    @UseGuards(AuthGuard)
    @Post('verify')
    async verify() {
        // return headers;
        return true;
    }
}
