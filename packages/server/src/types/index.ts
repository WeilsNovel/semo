/**
 * 服务端内部类型 - 不对外暴露（对外契约在 @semo/shared）
 * 约束：禁止 any；运行时/鉴权/AI 适配器内部结构定义于此
 */
import type { AI_PROVIDER, AI_MODEL } from '@semo/shared';

/** JWT 载荷（签发/校验用） */
export interface JwtPayload {
  /** 用户ID */
  sub: number;
  /** 微信 openid */
  openid?: string;
  /** 签发时间（秒） */
  iat?: number;
  /** 过期时间（秒） */
  exp?: number;
}

/** 鉴权后挂载到 req.user 的对象 */
export interface AuthedUser {
  id: number;
  openid?: string;
}

/** 微信 jscode2session 返回 */
export interface WxSessionResult {
  openid: string;
  session_key?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

/** GLM 多模态消息内容片段 */
export type GlmContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

/** 统一 AI 消息结构（content 支持纯文本或多模态片段） */
export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | GlmContentPart[];
}

/** AI 调用入参（运行时） */
export interface AiClientCallParams {
  /** 供应商 */
  provider: (typeof AI_PROVIDER)[keyof typeof AI_PROVIDER];
  /** 模型名 */
  model: (typeof AI_MODEL)[keyof typeof AI_MODEL] | string;
  /** 消息列表 */
  messages: AiMessage[];
  /** 温度 */
  temperature: number;
  /** max tokens */
  maxTokens: number;
  /** 超时 ms */
  timeout: number;
  /** 调用追踪ID（透传给日志/aiTraceId） */
  traceId?: string;
}

/** AI 调用返回 */
export interface AiClientCallResult {
  /** 模型返回文本 */
  content: string;
  /** token 用量 */
  usage: { totalTokens: number };
}

/** GLM chat/completions 响应结构（仅取需要的字段） */
export interface GlmChatCompletionResponse {
  id?: string;
  choices?: Array<{
    message?: { role?: string; content?: string };
    finish_reason?: string;
  }>;
  usage?: { total_tokens?: number; prompt_tokens?: number; completion_tokens?: number };
  error?: { code?: string; message?: string };
}
