/**
 * 业务枚举 - 前后端共享
 * 约束：服务端数据库存储值必须与此一致，前端展示/判断必须引用此常量
 */

/** 用户状态 */
export const USER_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

/** 打卡记录状态 */
export const RECORD_STATUS = {
  /** 正常 */
  NORMAL: 1,
  /** 已删除 */
  DELETED: 99,
} as const;

/** 餐次类型 */
export const MEAL_TYPE = {
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
  SNACK: 4,
} as const;

/** 计划类型 */
export const PLAN_TYPE = {
  /** 减脂 */
  FAT_LOSS: 1,
  /** 增肌 */
  MUSCLE_GAIN: 2,
  /** 维持 */
  MAINTAIN: 3,
} as const;

/** 食物分类 */
export const FOOD_CATEGORY = {
  STAPLE: 1,
  MEAT: 2,
  VEGETABLE: 3,
  FRUIT: 4,
  DAIRY: 5,
  BEVERAGE: 6,
  OTHER: 99,
} as const;
