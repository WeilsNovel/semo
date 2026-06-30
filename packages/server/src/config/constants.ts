/**
 * 服务端静态参数 - 端口/超时/分页/JWT/上传/微信/GLM
 * 约束：禁止硬编码，全局变更仅改此文件
 */

/** 服务运行参数 */
export const SERVER_CONFIG = {
  port: 3000,
  requestTimeout: 15000,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

/** JWT 配置 */
export const JWT_CONFIG = {
  expiresIn: '7d',
} as const;

/** CORS 配置 */
export const CORS_CONFIG = {
  origin: true,
  credentials: true,
} as const;

/** 静态资源服务配置（上传文件对外可访问） */
export const STATIC_CONFIG = {
  /** 静态根目录（相对 server 包根） */
  rootDir: 'static',
  /** 对外 URL 前缀 */
  urlPrefix: '/static',
} as const;

/** 图片上传配置 */
export const UPLOAD_CONFIG = {
  /** 上传子目录（相对 STATIC_CONFIG.rootDir） */
  subDir: 'uploads',
  /** 允许的 MIME 类型 */
  allowedMimeTypes: ['image/jpeg', 'image/png'] as readonly string[],
  /** 最大文件大小（字节，5MB） */
  maxFileSize: 5 * 1024 * 1024,
} as const;

/** 微信小程序登录配置 */
export const WX_CONFIG = {
  /** jscode2session 接口地址 */
  jscode2sessionUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  /** mock openid 前缀（环境未配置 appid 时使用） */
  mockOpenidPrefix: 'mock_openid_',
} as const;

/** GLM（智谱）运行时配置 */
export const GLM_CONFIG = {
  /** chat/completions 路径（相对 baseUrl） */
  chatCompletionsPath: '/chat/completions',
  /** JWT 有效期（秒） */
  tokenExpSeconds: 180,
  /** 默认模型 */
  defaultModel: 'glm-4v',
  /** 默认 baseUrl */
  defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
} as const;
