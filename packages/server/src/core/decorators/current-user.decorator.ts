/**
 * @CurrentUser() 参数装饰器 - 从 req.user 取已鉴权用户ID
 * 约束：仅配合 JwtAuthGuard 使用；未鉴权路由不应使用
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthedUser } from '../../types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthedUser => {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthedUser }>();
    if (!req.user) {
      throw new Error('CurrentUser decorator used without JwtAuthGuard');
    }
    return req.user;
  },
);
