/**
 * AI 环境参数模板（仅占位，真实 Key 在 packages/server 的 .env）
 * 约束：API Key 永不写入本包，由服务端 env 持有并经 process.env 注入
 */
import { AI_PROVIDER } from '@semo/shared';

/** 各供应商环境配置占位模板（运行时由 server 注入真实值） */
export const AI_ENV_TEMPLATE = {
  [AI_PROVIDER.OPENAI]: {
    apiKey: 'OPENAI_API_KEY_PLACEHOLDER',
    baseUrl: 'https://api.openai.com/v1',
  },
  [AI_PROVIDER.QWEN]: {
    apiKey: 'QWEN_API_KEY_PLACEHOLDER',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
  },
  [AI_PROVIDER.ZHIPU]: {
    apiKey: 'ZHIPU_API_KEY_PLACEHOLDER',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  },
  [AI_PROVIDER.DEEPSEEK]: {
    apiKey: 'DEEPSEEK_API_KEY_PLACEHOLDER',
    baseUrl: 'https://api.deepseek.com/v1',
  },
} as const;
