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

    generateToken(user: User) {
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

    verifyToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users',
            });
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

        const { id } = this.verifyToken(token);
        if (!id) {
            throw new UnauthorizedException('Token inválido');
        }

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
            throw new BadRequestException('Dados do usuário inválidos');
        }
        return this.generateToken(user);
    }

    isValidToken(token: string) {
        try {
            this.jwtService.verify(token);
            return true;
        } catch (e) {
            return false;
        }
    }
}
