import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const {authorization} = context.switchToHttp().getRequest().headers;
      if (!authorization) {
        return false;
      }
      const token = authorization.split(' ')[1];
      if (!token) {
        return false;
      }
      const isValid = this.authService.isValidToken(token);
      return isValid;
    }
}
