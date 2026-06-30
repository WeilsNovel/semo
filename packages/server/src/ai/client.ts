/**
 * AI 客户端运行时 - 智谱 GLM-4V 调用实现
 * 约束：API Key 从 env 读取，禁止硬编码；Prompt 模板引用 @semo/ai
 *       超时/调用异常抛 AiRuntimeError(kind=call)，解析失败抛 AiRuntimeError(kind=recognize)
 *       上层 food service 捕获后映射为 ERROR_CODE.AI_CALL_ERROR / AI_RECOGNIZE_FAILED
 */
import { env } from '../config';
import { GLM_CONFIG } from '../config/constants';
import { AI_PROVIDER } from '@semo/shared';
import type { AiClientCallParams, AiClientCallResult, GlmChatCompletionResponse } from '../types';
import { generateGlmToken } from './glm-token';

/** AI 运行时错误（携带分类，便于上层映射错误码） */
export class AiRuntimeError extends Error {
  constructor(
    message: string,
    public readonly kind: 'call' | 'recognize',
  ) {
    super(message);
    this.name = 'AiRuntimeError';
  }
}

/**
 * AI 客户端调用入口 - 按 provider 路由
 * MVP 仅接 zhipu(GLM-4V)，其他供应商后续波次接入
 */
export async function callAi(params: AiClientCallParams): Promise<AiClientCallResult> {
  const { provider } = params;
  if (provider !== AI_PROVIDER.ZHIPU) {
    throw new AiRuntimeError(
      `AI provider '${provider}' 暂未接入（MVP 仅支持 zhipu/GLM-4V）`,
      'call',
    );
  }
  return callGlm(params);
}

/** 智谱 GLM chat/completions 调用 */
async function callGlm(params: AiClientCallParams): Promise<AiClientCallResult> {
  const { apiKey, model, baseUrl } = env.ai.glm;
  if (!apiKey || apiKey === 'changeme') {
    throw new AiRuntimeError('GLM_API_KEY 未配置', 'call');
  }

  const token = generateGlmToken(apiKey);
  const url = `${baseUrl}${GLM_CONFIG.chatCompletionsPath}`;
  const body = {
    model,
    messages: params.messages,
    temperature: params.temperature,
    max_tokens: params.maxTokens,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), params.timeout);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiRuntimeError(
        `GLM HTTP ${res.status}: ${text.slice(0, 200)}`,
        'call',
      );
    }
    const data = (await res.json()) as GlmChatCompletionResponse;
    if (data.error) {
      throw new AiRuntimeError(`GLM error ${data.error.code}: ${data.error.message}`, 'call');
    }
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new AiRuntimeError('GLM 返回内容为空', 'recognize');
    }
    const totalTokens = data.usage?.total_tokens ?? 0;
    return { content, usage: { totalTokens } };
  } catch (err) {
    if (err instanceof AiRuntimeError) throw err;
    // 超时/网络异常归为调用错误
    throw new AiRuntimeError(
      `GLM 调用异常: ${err instanceof Error ? err.message : String(err)}`,
      'call',
    );
  } finally {
    clearTimeout(timer);
  }
}
