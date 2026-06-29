/**
 * 服务端环境配置 - 读取 process.env，禁止硬编码
 * 真实值由 .env 注入，代码仅读取
 */
export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    type: (process.env.DB_TYPE || 'postgres') as 'postgres' | 'mysql',
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
    provider: process.env.AI_PROVIDER || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    },
    qwen: { apiKey: process.env.QWEN_API_KEY || '' },
    zhipu: { apiKey: process.env.ZHIPU_API_KEY || '' },
    deepseek: { apiKey: process.env.DEEPSEEK_API_KEY || '' },
  },
  mp: {
    appid: process.env.MP_APPID || '',
    secret: process.env.MP_SECRET || '',
  },
} as const;
