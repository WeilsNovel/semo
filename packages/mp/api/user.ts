/**
 * 用户接口 - 引用 shared 类型
 */
import { request } from '@/core/request';
import type {
  UserLoginRequest,
  UserLoginResponse,
  UserProfileUpdateRequest,
  UserItem,
} from '@semo/shared';

/** 微信登录 */
export function login(req: UserLoginRequest): Promise<UserLoginResponse> {
  return request<UserLoginResponse>({
    url: '/user/login',
    method: 'POST',
    data: req as unknown as Record<string, unknown>,
  });
}

/** 获取用户档案 */
export function getUserProfile(): Promise<UserItem> {
  return request<UserItem>({ url: '/user/profile', method: 'GET' });
}

/** 更新用户档案 */
export function updateUserProfile(req: UserProfileUpdateRequest): Promise<UserItem> {
  return request<UserItem>({
    url: '/user/profile',
    method: 'PUT',
    data: req as unknown as Record<string, unknown>,
  });
}
