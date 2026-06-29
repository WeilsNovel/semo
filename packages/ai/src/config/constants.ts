/**
 * AI 静态参数 - 模型/温度/max_tokens/重试/超时
 * 约束：禁止硬编码，全部用具名常量
 */
import { AI_MODEL } from '@semo/shared';

/** AI 场景默认模型配置（场景→模型） */
export const AI_SCENE_MODEL_MAP = {
  /** 食物识别用视觉模型 */
  food_recognize: AI_MODEL.OPENAI_GPT4O,
  /** 计划生成用通用模型 */
  plan_generate: AI_MODEL.OPENAI_GPT4O,
} as const;

/** AI 场景默认生成参数 */
export const AI_SCENE_PARAMS = {
  food_recognize: {
    temperature: 0.2,
    maxTokens: 2000,
    timeout: 30000,
    retryTimes: 2,
  },
  plan_generate: {
    temperature: 0.7,
    maxTokens: 3000,
    timeout: 45000,
    retryTimes: 2,
  },
} as const;

/** 通用默认生成参数 */
export const DEFAULT_AI_PARAMS = {
  temperature: 0.5,
  maxTokens: 2000,
  timeout: 30000,
  retryTimes: 2,
} as const;
