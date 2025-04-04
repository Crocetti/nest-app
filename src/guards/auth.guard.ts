import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;
        try {
            const data = this.authService.verifyToken((authorization ?? '').split(' ')[1]);
            const user = await this.userService.readOne(data.id);
            request.payload = data;
            request.user = user;
            return true;
        } catch (error) {
            return false;
        }
    }
}
