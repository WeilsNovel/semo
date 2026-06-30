/**
 * 用户服务 - 登录/档案
 * 约束：微信 code→openid（未配置时 mock 占位）；JWT 用 JwtService 签发
 *       返回值对齐 shared UserLoginResponse / UserItem
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ERROR_CODE, USER_STATUS } from '@semo/shared';
import type { UserItem, UserLoginResponse, UserProfileUpdateRequest } from '@semo/shared';
import { env } from '../../config';
import { WX_CONFIG } from '../../config/constants';
import { UserEntity } from '../../database/entities/user.entity';
import type { JwtPayload, WxSessionResult } from '../../types';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /** 微信登录：code → openid → 查/建用户 → 签 JWT */
  async login(code: string): Promise<UserLoginResponse> {
    const openid = await this.resolveOpenid(code);
    // 查用户，不存在则创建
    let user = await this.userRepo.findOneBy({ openid });
    if (!user) {
      user = this.userRepo.create({
        openid,
        nickname: '',
        avatar: '',
        gender: 0,
        status: USER_STATUS.ENABLED,
      });
      user = await this.userRepo.save(user);
    }
    const payload: JwtPayload = { sub: user.id, openid: user.openid };
    const token = await this.jwtService.signAsync(payload);
    return { token, user: this.toUserItem(user) };
  }

  /** 获取用户档案 */
  async getProfile(userId: number): Promise<UserItem> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ code: ERROR_CODE.NOT_FOUND, message: '用户不存在' });
    }
    return this.toUserItem(user);
  }

  /** 更新用户档案 */
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<UserItem> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ code: ERROR_CODE.NOT_FOUND, message: '用户不存在' });
    }
    // 仅更新传入的字段
    const patch: UserProfileUpdateRequest = {};
    if (dto.nickname !== undefined) patch.nickname = dto.nickname;
    if (dto.avatar !== undefined) patch.avatar = dto.avatar;
    if (dto.gender !== undefined) patch.gender = dto.gender;
    if (dto.age !== undefined) patch.age = dto.age;
    if (dto.height !== undefined) patch.height = dto.height;
    if (dto.weight !== undefined) patch.weight = dto.weight;
    if (dto.targetCalories !== undefined) patch.targetCalories = dto.targetCalories;

    Object.assign(user, patch);
    const updated = await this.userRepo.save(user);
    return this.toUserItem(updated);
  }

  /** code → openid（配置了 MP_APPID 调微信，否则走 mock 占位） */
  private async resolveOpenid(code: string): Promise<string> {
    if (!env.mp.appid || env.mp.appid === 'changeme' || !env.mp.secret) {
      // TODO(技术债): 微信凭据未配置，MVP 走 mock openid，接入真实小程序后移除
      const mockOpenid = `${WX_CONFIG.mockOpenidPrefix}${code}`;
      this.logger.warn(`[login] MP_APPID 未配置，使用 mock openid=${mockOpenid}`);
      return mockOpenid;
    }
    const url =
      `${WX_CONFIG.jscode2sessionUrl}` +
      `?appid=${encodeURIComponent(env.mp.appid)}` +
      `&secret=${encodeURIComponent(env.mp.secret)}` +
      `&js_code=${encodeURIComponent(code)}` +
      `&grant_type=authorization_code`;
    const res = await fetch(url);
    const data = (await res.json()) as WxSessionResult;
    if (!data.openid || data.errcode) {
      throw new Error(`wx jscode2session failed: ${data.errmsg || 'no openid'}`);
    }
    return data.openid;
  }

  /** 实体 → shared UserItem（时间戳转 ISO 字符串） */
  private toUserItem(e: UserEntity): UserItem {
    return {
      id: e.id,
      nickname: e.nickname,
      avatar: e.avatar || undefined,
      gender: e.gender,
      age: e.age ?? undefined,
      height: e.height ?? undefined,
      weight: e.weight ?? undefined,
      targetCalories: e.targetCalories ?? undefined,
      status: e.status as (typeof USER_STATUS)[keyof typeof USER_STATUS],
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }
}
