import type { MEAL_TYPE, RECORD_STATUS } from '../constants/business';
import type { FoodRecognizeItem } from './food';

/** 打卡记录实体 - 前后端共享 */
export interface RecordItem {
  id: number;
  /** 用户ID */
  userId: number;
  /** 餐次 */
  mealType: (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE];
  /** 识别结果快照（落库时的食物项） */
  items: FoodRecognizeItem[];
  /** 该餐总热量(kcal) */
  totalCalories: number;
  /** 打卡图片URL */
  imageUrl: string;
  /** 打卡日期 YYYY-MM-DD */
  recordDate: string;
  status: (typeof RECORD_STATUS)[keyof typeof RECORD_STATUS];
  createdAt: string;
  updatedAt: string;
}

/** 打卡记录列表查询入参 */
export interface RecordListRequest {
  /** 日期范围起 YYYY-MM-DD */
  startDate?: string;
  /** 日期范围止 YYYY-MM-DD */
  endDate?: string;
  /** 餐次筛选 */
  mealType?: number;
}

/** 打卡记录创建入参 */
export interface RecordCreateRequest {
  mealType: (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE];
  items: FoodRecognizeItem[];
  totalCalories: number;
  imageUrl: string;
  recordDate: string;
}

/** 每日统计响应 */
export interface DailyStatResponse {
  recordDate: string;
  /** 当日总热量(kcal) */
  totalCalories: number;
  /** 目标热量 */
  targetCalories: number;
  /** 当日打卡次数 */
  recordCount: number;
  /** 三餐分布 */
  mealBreakdown: Record<string, number>;
}
