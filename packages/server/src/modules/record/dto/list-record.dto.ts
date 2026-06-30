/**
 * 打卡列表查询 DTO - 字段对齐 shared RecordListRequest（extends PageQuery）
 * 约束：分页参数必填；日期/餐次可选
 */
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SERVER_CONFIG } from '../../../config/constants';
import type { RecordListRequest } from '@semo/shared';

export class ListRecordDto implements RecordListRequest {
  /** 页码（从1开始） */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum: number;

  /** 每页条数 */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SERVER_CONFIG.maxPageSize)
  pageSize: number;

  /** 起始日期 YYYY-MM-DD */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /** 结束日期 YYYY-MM-DD */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /** 餐次筛选 */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mealType?: number;
}
