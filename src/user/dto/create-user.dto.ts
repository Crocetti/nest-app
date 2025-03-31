import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';

import { Role } from 'src/enum/role.enum';

export class CreateUserDto {
    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
        minLowercase: 0,
    })
    senha: string;

    @IsOptional()
    @IsDateString()
    birthAt: string;

    @IsOptional()
    @IsEnum(Role)
    role: string;
}
