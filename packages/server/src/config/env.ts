/**
 * 服务端环境配置 - 读取 process.env，禁止硬编码
 * 真实值由 .env 注入，代码仅读取
 */
import { GLM_CONFIG } from './constants';

/** 服务端环境配置（运行时只读快照） */
export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    type: 'postgres' as const,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'semo',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'semo',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  ai: {
    /** 当前启用的供应商（MVP 默认 zhipu） */
    provider: (process.env.AI_PROVIDER || 'zhipu') as 'zhipu',
    /** 智谱 GLM 配置（视觉用 GLM-4V） */
    glm: {
      apiKey: process.env.GLM_API_KEY || '',
      model: process.env.GLM_MODEL || GLM_CONFIG.defaultModel,
      baseUrl: process.env.GLM_BASE_URL || GLM_CONFIG.defaultBaseUrl,
    },
  },
  mp: {
    appid: process.env.MP_APPID || '',
    secret: process.env.MP_SECRET || '',
  },
} as const;
