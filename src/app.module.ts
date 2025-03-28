import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule, PrismaModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
