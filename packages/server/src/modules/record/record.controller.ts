/**
 * 打卡记录 controller - POST /record、GET /record/list、GET /record/daily-stat（均需鉴权）
 * 约束：直接返回 data，由 ResponseInterceptor 包裹 BaseApiResponse
 */
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { ListRecordDto } from './dto/list-record.dto';
import { DailyStatDto } from './dto/daily-stat.dto';
import { JwtAuthGuard, CurrentUser } from '../../core';
import type { AuthedUser } from '../../types';

@Controller('record')
@UseGuards(JwtAuthGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  /** 创建打卡记录 */
  @Post()
  async create(@CurrentUser() user: AuthedUser, @Body() dto: CreateRecordDto) {
    return this.recordService.create(user.id, dto);
  }

  /** 打卡记录列表（分页） */
  @Get('list')
  async list(@CurrentUser() user: AuthedUser, @Query() dto: ListRecordDto) {
    return this.recordService.list(user.id, dto);
  }

  /** 当日统计 */
  @Get('daily-stat')
  async dailyStat(@CurrentUser() user: AuthedUser, @Query() dto: DailyStatDto) {
    return this.recordService.dailyStat(user.id, dto.date);
  }
}
