import { ExecutionContext, NotFoundException, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new NotFoundException('Usuário não encontrado no request, use auth guard');
    }
    return user[data] ?? user;
});
