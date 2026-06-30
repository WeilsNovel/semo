/**
 * 打卡记录接口 - 引用 shared 类型，禁止前端单独定义
 * 契约对齐（mvp-v1）：
 *   - POST /record（非 /record/create）
 *   - GET /record/list 返回 PageData<RecordItem>
 *   - GET /record/daily-stat 入参字段为 date（DailyStatRequest）
 */
import { request } from '@/core/request';
import { PAGINATION_CONFIG } from '@/config';
import type {
  RecordListRequest,
  RecordCreateRequest,
  RecordItem,
  DailyStatResponse,
  DailyStatRequest,
  PageData,
} from '@semo/shared';

/** 获取打卡记录列表（分页） */
export function getRecordList(req?: Partial<RecordListRequest>): Promise<PageData<RecordItem>> {
  const merged: RecordListRequest = {
    pageNum: req?.pageNum ?? 1,
    pageSize: req?.pageSize ?? PAGINATION_CONFIG.defaultPageSize,
    startDate: req?.startDate,
    endDate: req?.endDate,
    mealType: req?.mealType,
  };
  return request<PageData<RecordItem>>({
    url: '/record/list',
    method: 'GET',
    data: merged as unknown as Record<string, unknown>,
  });
}

/** 创建打卡记录 */
export function createRecord(req: RecordCreateRequest): Promise<RecordItem> {
  return request<RecordItem>({
    url: '/record',
    method: 'POST',
    data: req as unknown as Record<string, unknown>,
  });
}

/** 获取当日统计 */
export function getDailyStat(req?: DailyStatRequest): Promise<DailyStatResponse> {
  return request<DailyStatResponse>({
    url: '/record/daily-stat',
    method: 'GET',
    data: req as unknown as Record<string, unknown>,
  });
}
