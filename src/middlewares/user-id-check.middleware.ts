import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { isUUID } from 'class-validator';

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('userIdCheckMiddleware', 'antes');

        if (!isUUID(req.params.id)) {
            throw new BadRequestException('Invalid UUID');
        }
        console.log('userIdCheckMiddleware', 'depois');
        next();
    }
}
