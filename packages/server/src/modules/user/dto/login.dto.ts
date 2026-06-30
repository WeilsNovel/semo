/**
 * 用户登录 DTO - 字段对齐 shared UserLoginRequest
 * 约束：仅校验入参，不重新定义响应类型
 */
import { IsString } from 'class-validator';
import type { UserLoginRequest } from '@semo/shared';

export class LoginDto implements UserLoginRequest {
  /** 微信小程序登录 code */
  @IsString()
  code: string;
}
