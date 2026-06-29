import type { PLAN_TYPE } from '../constants/business';

/** 计划实体 - 前后端共享 */
export interface PlanItem {
  id: number;
  userId: number;
  /** 计划类型 */
  type: (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];
  /** 计划名称 */
  name: string;
  /** 目标每日热量(kcal) */
  targetCalories: number;
  /** 计划描述 */
  description: string;
  /** 生效起始日期 YYYY-MM-DD */
  startDate: string;
  /** 生效结束日期 YYYY-MM-DD */
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

/** 生成计划入参 */
export interface PlanGenerateRequest {
  /** 计划类型 */
  type: (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];
  /** 用户当前体重 */
  currentWeight: number;
  /** 目标体重 */
  targetWeight: number;
  /** 周期天数 */
  durationDays: number;
  /** 饮食偏好/限制 */
  dietaryPreferences?: string[];
}

/** 生成计划响应 */
export interface PlanGenerateResponse {
  plan: PlanItem;
  /** AI 生成的每日建议（早餐/午餐/晚餐/加餐参考） */
  dailyAdvice: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack?: string;
  };
}
