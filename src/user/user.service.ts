import * as bcrypt from 'bcrypt';

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: CreateUserDto) {
        const salt = bcrypt.genSaltSync();
        data.senha = await bcrypt.hash(data.senha, salt);
        return this.prismaService.user.create({
            data,
        });
    }

    async list() {
        return this.prismaService.user.findMany();
    }

    async readOne(id: string) {
        return this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
    }

    async update(id: string, data: UpdatePutUserDto) {
        await this.exists(id);
        const salt = bcrypt.genSaltSync();
        data.senha = await bcrypt.hash(data.senha, salt);
        return this.prismaService.user.update({
            data: {
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                birthAt: data.birthAt ? new Date(data.birthAt) : null,
                role: data.role ? data.role : 'User',
            },
            where: {
                id,
            },
        });
    }

    async updatePartial(id: string, { nome, email, senha, birthAt, role }: UpdatePatchUserDto) {
        await this.exists(id);
        const data = {} as any;
        {
            data.nome = nome;
        }
        if (email) {
            data.email = email;
        }
        if (senha) {
            const salt = bcrypt.genSaltSync();
            data.senha = await bcrypt.hash(senha, salt);
        }
        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }
        if (role) {
            data.role = role;
        }
        return this.prismaService.user.update({
            data,
            where: {
                id,
            },
        });
    }
    async delete(key: string) {
        await this.exists(key);
        return this.prismaService.user.delete({
            where: {
                id: key,
            },
        });
    }

    async exists(id: string) {
        if (!(await this.readOne(id))) {
            throw new NotFoundException(`Usuário com id ${id} não enconntrado`);
        }
    }
}
