/**
 * 用户 controller - 登录(无鉴权) + 档案(需鉴权)
 * 约束：直接返回 data，由 ResponseInterceptor 包裹 BaseApiResponse
 */
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard, CurrentUser } from '../../core';
import type { AuthedUser } from '../../types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 微信登录 */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto.code);
  }

  /** 获取当前用户档案 */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthedUser) {
    return this.userService.getProfile(user.id);
  }

  /** 更新当前用户档案 */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: AuthedUser, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }
}
