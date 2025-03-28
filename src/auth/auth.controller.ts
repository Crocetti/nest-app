import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login-dto';
import { AuthRegisterDto } from './dto/auth-register-dto';
import { AuthForgetDto } from './dto/auth-forget-dto';
import { AuthResetDto } from './dto/auth-reset-dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

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
    @Post('amem')
    async amem(@Req() req) {
        console.log(req);
        return { ok: true };
    }}
