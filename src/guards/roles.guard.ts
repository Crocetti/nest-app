import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const filteredRoles = requiredRoles.filter((role) => role === user.role);
        return filteredRoles.length > 0;
    }
}
