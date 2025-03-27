import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthLoginDto {
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
}
