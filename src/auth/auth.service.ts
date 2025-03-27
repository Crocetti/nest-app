/* eslint-disable @typescript-eslint/require-await */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthRegisterDto } from './dto/auth-register-dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async generateToken(user: User) {
        return this.jwtService.sign(
            {
                id: user.id,
                nome: user.nome,
                email: user.email,
            },
            {
                expiresIn: '7d',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users',
            },
        );
    }

    async verifyToken(token: string) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data = await this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users',
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async login(email: string, senha: string): Promise<string> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                senha,
            },
        });
        if (!user) {
            throw new UnauthorizedException(' email e/ou senha incorretos');
        }
        return this.generateToken(user);
    }

    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            throw new UnauthorizedException(' email e/ou senha incorretos');
        }
        // TO DO: Enviar email com o token de reset

        return this.generateToken(user);
    }

    async reset(password: string, token: string) {
        // TO DO: Validar o token

        const id = `bc0f38fe-ec1a-4d51-a241-b490e5c5f103`;

        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                senha: password,
            },
        });
        return this.generateToken(user);
    }

    async register(data: AuthRegisterDto) {
        const user = await this.userService.create(data);
        if (!user) {
            throw new BadRequestException('Usuário já existe');
        }
        return this.generateToken(user);
    }

    async isValidToken(token: string) {
        try {
            const data = this.jwtService.verify(token);
            return true;
        } catch (e) {
            return false;
        }
    }   
}
