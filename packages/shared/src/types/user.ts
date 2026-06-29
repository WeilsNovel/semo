import type { USER_STATUS } from '../constants/business';

/** 用户实体 - 前后端共享 */
export interface UserItem {
  id: number;
  /** 昵称 */
  nickname: string;
  /** 头像URL */
  avatar?: string;
  /** 性别：0未知 1男 2女 */
  gender: 0 | 1 | 2;
  /** 年龄 */
  age?: number;
  /** 身高(cm) */
  height?: number;
  /** 体重(kg) */
  weight?: number;
  /** 目标每日摄入卡路里 */
  targetCalories?: number;
  status: (typeof USER_STATUS)[keyof typeof USER_STATUS];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 用户登录入参 */
export interface UserLoginRequest {
  /** 微信小程序 code */
  code: string;
}

/** 用户登录响应 */
export interface UserLoginResponse {
  /** JWT token */
  token: string;
  /** 用户信息 */
  user: UserItem;
}

/** 更新用户档案入参 */
export interface UserProfileUpdateRequest {
  nickname?: string;
  avatar?: string;
  gender?: 0 | 1 | 2;
  age?: number;
  height?: number;
  weight?: number;
  targetCalories?: number;
}
