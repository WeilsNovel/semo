/**
 * 服务端静态参数 - 端口/超时/分页/JWT
 * 约束：禁止硬编码，全局变更仅改此文件
 */
export const SERVER_CONFIG = {
  port: 3000,
  requestTimeout: 15000,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const JWT_CONFIG = {
  expiresIn: '7d',
} as const;

export const CORS_CONFIG = {
  origin: true,
  credentials: true,
} as const;
