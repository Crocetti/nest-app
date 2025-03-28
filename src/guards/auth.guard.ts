import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;
        try {
            const data = this.authService.verifyToken((authorization ?? '').split(' ')[1]);
            request.payload = data;
            console.log(request.payload);
            return true;
        } catch (error) {
            return false;
        }
    }
}
