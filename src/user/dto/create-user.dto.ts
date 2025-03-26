import { IsDateString, IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
	@IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsStrongPassword(
        {
            minLength: 8,
            minNumbers: 0,
            minSymbols: 0,
            minUppercase: 0,
            minLowercase: 0,
        }
    )
    senha: string;

    @IsOptional()
    @IsDateString()
    birthAt: string;
}
