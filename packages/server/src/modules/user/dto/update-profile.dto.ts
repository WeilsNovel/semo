/**
 * 更新用户档案 DTO - 字段对齐 shared UserProfileUpdateRequest
 * 约束：所有字段可选；gender 限定 0/1/2
 */
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type { UserProfileUpdateRequest } from '@semo/shared';

export class UpdateProfileDto implements UserProfileUpdateRequest {
  /** 昵称 */
  @IsOptional()
  @IsString()
  nickname?: string;

  /** 头像URL */
  @IsOptional()
  @IsString()
  avatar?: string;

  /** 性别：0未知 1男 2女 */
  @IsOptional()
  @IsIn([0, 1, 2])
  gender?: 0 | 1 | 2;

  /** 年龄 */
  @IsOptional()
  @IsInt()
  age?: number;

  /** 身高(cm) */
  @IsOptional()
  @IsInt()
  height?: number;

  /** 体重(kg) */
  @IsOptional()
  @IsInt()
  weight?: number;

  /** 目标每日摄入卡路里 */
  @IsOptional()
  @IsInt()
  targetCalories?: number;
}
