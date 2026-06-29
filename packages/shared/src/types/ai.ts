/**
 * AI 调用共享类型 - 前后端共享
 * 用于 AI 请求/响应的 DTO，前端发请求时引用，服务端响应时引用
 * 真实 API Key 仅在服务端 env，前端不持有
 */
import type { AI_SCENE } from '../constants/ai-model';

/** AI 消息角色 */
export type AiMessageRole = 'system' | 'user' | 'assistant';

/** AI 消息体 */
export interface AiMessage {
  role: AiMessageRole;
  content: string;
}

/** AI 请求入参（前端→服务端→AI运行时） */
export interface AiRequest {
  /** AI 场景 */
  scene: (typeof AI_SCENE)[keyof typeof AI_SCENE];
  /** 消息列表 */
  messages: AiMessage[];
  /** 是否流式响应 */
  stream?: boolean;
  /** 模型覆盖（可选） */
  model?: string;
}

/** AI 响应 */
export interface AiResponse {
  /** AI 输出文本 */
  content: string;
  /** 使用的模型 */
  model: string;
  /** token 用量 */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** AI 追踪ID */
  traceId: string;
}

/** AI 工具调用 */
export interface AiToolCall {
  /** 工具名 */
  name: string;
  /** 调用参数 */
  arguments: Record<string, unknown>;
}
