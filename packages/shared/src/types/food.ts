import type { FOOD_CATEGORY } from '../constants/business';

/** 食物识别项（单张照片中的一个识别结果） */
export interface FoodRecognizeItem {
  /** 食物名称 */
  name: string;
  /** 食物分类 */
  category: (typeof FOOD_CATEGORY)[keyof typeof FOOD_CATEGORY];
  /** 估计重量(g) */
  weight: number;
  /** 估计热量(kcal) */
  calories: number;
  /** 碳水(g) */
  carbs?: number;
  /** 蛋白质(g) */
  protein?: number;
  /** 脂肪(g) */
  fat?: number;
  /** 识别置信度 0-1 */
  confidence: number;
}

/** 食物识别入参（前端发、服务端收，结构必须完全一致） */
export interface FoodRecognizeRequest {
  /** 图片base64（不含data:前缀）或图片URL（由前端与服务端约定） */
  image: string;
  /** 图片来源标识：base64 / url */
  imageType: 'base64' | 'url';
  /** 餐次（可选，影响识别后落库的默认归属） */
  mealType?: number;
}

/** 食物识别响应 */
export interface FoodRecognizeResponse {
  /** 识别结果列表（一张照片可能含多种食物） */
  items: FoodRecognizeItem[];
  /** 识别总热量(kcal) */
  totalCalories: number;
  /** AI 识别追踪ID（用于反查） */
  aiTraceId: string;
}
