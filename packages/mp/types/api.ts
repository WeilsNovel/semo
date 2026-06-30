/**
 * 前端 api 层辅助类型
 * 约束：接口契约类型必须引用 @semo/shared，本文件仅放前端独有包装类型
 */
import type { BaseApiResponse } from '@semo/shared';

/** Mock 路由处理器签名 - 返回业务数据，由 mock 包装层包成 BaseApiResponse */
export type MockHandler<T = unknown> = (data?: Record<string, unknown>) => T | Promise<T>;

/** Mock 路由表 key */
export interface MockRouteKey {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

/** Mock 包装结果 - 已包成 BaseApiResponse */
export type MockResult<T = unknown> = BaseApiResponse<T>;
