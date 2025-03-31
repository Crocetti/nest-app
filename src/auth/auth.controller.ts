import {
    Body,
    Controller,
    FileTypeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login-dto';
import { AuthRegisterDto } from './dto/auth-register-dto';
import { AuthForgetDto } from './dto/auth-forget-dto';
import { AuthResetDto } from './dto/auth-reset-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
        console.log(email);
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { senha, token }: AuthResetDto) {
        return this.authService.reset(senha, token);
    }

    @UseGuards(AuthGuard)
    @Post('verify')
    async verify(@User() user) {
        const result = await Promise.resolve({ user });
        return result;
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'image/*' })],
            }),
        )
        photo: Express.Multer.File,
    ) {
        console.log(photo);
        const retorno = await writeFile(
            join(
                __dirname,
                '..',
                '..',
                'storage',
                'photo',
                `${photo.originalname.split('.')[0]}_${user.id}.${photo.originalname.split('.')[1]}`,
            ),
            photo.buffer,
        );
        return retorno;
    }

    @UseInterceptors(FilesInterceptor('files', 10))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
        files.forEach((file) => {
            writeFile(
                join(
                    __dirname,
                    '..',
                    '..',
                    'storage',
                    `${file.originalname.split('.')[0]}_${user.id}.${file.originalname.split('.')[1]}`,
                ),
                file.buffer,
            );
        });
        return files;
    }
}
