/**
 * JWT 鉴权守卫 - 校验 Authorization: Bearer <token>
 * 约束：失败抛 UNAUTHORIZED（共享错误码），禁止裸 401
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_CODE } from '@semo/shared';
import type { AuthedUser, JwtPayload } from '../../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: AuthedUser;
    }>();
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      throw new UnauthorizedException({
        code: ERROR_CODE.UNAUTHORIZED,
        message: '请先登录',
      });
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      req.user = { id: payload.sub, openid: payload.openid };
      return true;
    } catch {
      throw new UnauthorizedException({
        code: ERROR_CODE.UNAUTHORIZED,
        message: '登录已过期，请重新登录',
      });
    }
  }
}
