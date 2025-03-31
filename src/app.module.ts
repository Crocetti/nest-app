import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UserModule } from './user/user.module';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'harley.dooley66@ethereal.email',
                    pass: 'AgAwN6b8J1byBwxMuJ',
                },
            },
            defaults: {
                from: '"Howell Stehr" <howell12@ethereal.email>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
        UserModule,
        PrismaModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
