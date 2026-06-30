/**
 * 鉴权模块 - 全局注册 JwtService
 * 约束：secret 从 env 读取，禁止硬编码；未配置时用 dev 兜底（仅开发环境）
 */
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: env.jwt.secret || 'semo-dev-insecure-secret',
      signOptions: { expiresIn: env.jwt.expiresIn },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
