import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDto {
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
        minLowercase: 0,
    })
    senha: string;
    
    @IsJWT()
    token: string;
s
}
