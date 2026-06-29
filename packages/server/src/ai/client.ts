/**
 * AI 客户端运行时 - 多供应商适配（占位骨架，实际接入时填充）
 * 约束：API Key 从 env 读取，禁止硬编码；Prompt 模板引用 @semo/ai
 */
import { env } from '@/config';
import { AI_PROVIDER } from '@semo/shared';

/** AI 调用入参 */
export interface AiClientCallParams {
  /** 供应商 */
  provider: (typeof AI_PROVIDER)[keyof typeof AI_PROVIDER];
  /** 模型名 */
  model: string;
  /** 消息列表 */
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  /** 温度 */
  temperature: number;
  /** max tokens */
  maxTokens: number;
  /** 超时 ms */
  timeout: number;
}

/**
 * AI 客户端调用（骨架，待实际接入供应商 SDK）
 * TODO(技术债): 接入真实 SDK（openai-node / @alicloud/dashscope-sdk 等）
 */
export async function callAi(_params: AiClientCallParams): Promise<{ content: string; usage: { totalTokens: number } }> {
  // 占位实现：从 env 读取当前 provider 的 Key，调真实 SDK
  const currentProvider = env.ai.provider;
  void currentProvider;
  throw new Error('AI client not implemented yet, see TECH_DEBT.md');
}
