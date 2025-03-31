import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthRegisterDto } from './dto/auth-register-dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { link } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
    ) {}

    generateToken(user: User) {
        return this.jwtService.sign(
            {
                id: user.id,
                nome: user.nome,
                email: user.email,
            },
            {
                expiresIn: '7 days',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users',
            },
        );
    }

    verifyToken(token: string) {
        try {
            const data = this.jwtService.verify<User>(token, {
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
            },
        });
        if (!user) {
            throw new UnauthorizedException(' email e/ou senha incorretos');
        }
        if (!(await bcrypt.compare(senha, user.senha))) {
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
        const token = this.jwtService.sign(
            {
                id: user.id,
            },
            {
                expiresIn: '30 minutes',
                subject: String(user.id),
                issuer: 'forget',
                audience: 'users',
            },
        );
        await this.mailerService.sendMail({
            to: email,
            from: 'howell12@ethereal.email',
            subject: 'Recuperação de senha',
            template: 'forget',
            context: {
                name: user.nome,
                token: token,
            },
        });
        return { sucesso: true };
    }

    async reset(password: string, token: string) {
        // TO DO: Validar o token
        try {
            const { id } = this.jwtService.verify<User>(token, {
                issuer: 'forget',
                audience: 'users',
            });
            password = await bcrypt.hash(password, await bcrypt.genSalt());
            const user = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    senha: password,
                },
            });
            return this.generateToken(user);
        } catch (error) {
            throw new BadRequestException(error);
        }
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
