/**
 * AI 模型枚举 - 前后端共享
 * 约束：服务端 AI 运行时引用此枚举选模型，前端仅用于展示
 */
export const AI_PROVIDER = {
  OPENAI: 'openai',
  QWEN: 'qwen',
  ZHIPU: 'zhipu',
  DEEPSEEK: 'deepseek',
} as const;

export const AI_MODEL = {
  /** OpenAI 视觉模型（食物识别） */
  OPENAI_GPT4O: 'gpt-4o',
  /** 通义千问视觉模型 */
  QWEN_VL: 'qwen-vl-plus',
  /** 智谱视觉模型 */
  ZHIPU_GLM4V: 'glm-4v',
} as const;

/** AI 能力场景 */
export const AI_SCENE = {
  /** 食物识别 */
  FOOD_RECOGNIZE: 'food_recognize',
  /** 计划生成 */
  PLAN_GENERATE: 'plan_generate',
} as const;
