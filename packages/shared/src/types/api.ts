/**
 * 统一响应结构 - 前后端共享
 * 服务端全局响应拦截器必须输出此结构，前端 core/request.ts 解包此结构
 */
export interface BaseApiResponse<T = unknown> {
  /** 业务状态码（0=成功，非0=失败，对齐服务端） */
  code: number;
  /** 提示消息 */
  message: string;
  /** 业务数据 */
  data: T;
  /** 请求追踪ID（服务端生成，前端日志记录） */
  traceId?: string;
  /** 服务器时间戳（用于时间同步校验） */
  timestamp?: number;
}

/** 分页响应结构 - 前后端共享 */
export interface PageData<T = unknown> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/** 通用分页查询入参 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}
