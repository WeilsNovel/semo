/**
 * 当日统计查询 DTO - 字段对齐 shared DailyStatRequest
 * 约束：date 可选，默认当日（服务端兜底）
 */
import { IsDateString, IsOptional } from 'class-validator';
import type { DailyStatRequest } from '@semo/shared';

export class DailyStatDto implements DailyStatRequest {
  /** 查询日期 YYYY-MM-DD（默认当日） */
  @IsOptional()
  @IsDateString()
  date?: string;
}
