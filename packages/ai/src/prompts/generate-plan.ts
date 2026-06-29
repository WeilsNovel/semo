/**
 * 计划生成 Prompt 模板 - 参数化
 * 约束：模板用占位符，不硬编码用户数据；输出严格 JSON
 */
import type { PLAN_TYPE } from '@semo/shared';

/** 计划生成 Prompt 入参 */
export interface GeneratePlanPromptParams {
  /** 计划类型 */
  planType: (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];
  /** 当前体重(kg) */
  currentWeight: number;
  /** 目标体重(kg) */
  targetWeight: number;
  /** 周期天数 */
  durationDays: number;
  /** 饮食偏好/限制 */
  dietaryPreferences?: string[];
}

/** 计划生成系统提示词 */
export const GENERATE_PLAN_SYSTEM_PROMPT = `你是一个专业的健康饮食规划师。根据用户的体重目标、当前体重与周期，生成一份每日饮食建议。
要求：
1. 仅返回 JSON，不要任何额外文字或代码块标记。
2. JSON 结构：{"plan":{"name":"","targetCalories":0,"description":""},"dailyAdvice":{"breakfast":"","lunch":"","dinner":"","snack":""}}。
3. targetCalories 为该计划建议的每日摄入热量（千卡）。
4. 每日建议为简短可执行的饮食参考。`;

/** 计划生成用户提示词模板（变量用占位符） */
export const GENERATE_PLAN_USER_PROMPT_TEMPLATE = (params: GeneratePlanPromptParams): string => {
  const prefs = params.dietaryPreferences?.length ? params.dietaryPreferences.join('、') : '无特殊偏好';
  return `计划类型：${params.planType}。当前体重：${params.currentWeight}kg，目标体重：${params.targetWeight}kg，周期：${params.durationDays}天。饮食偏好/限制：${prefs}。请生成每日饮食建议。`;
};
