/**
 * 食物识别 Prompt 模板 - 参数化（运行时由服务端填充变量后调用 AI）
 * 约束：模板用占位符，不硬编码用户数据；输出严格 JSON 以便服务端解析
 */

/** 食物识别 Prompt 入参 */
export interface RecognizeFoodPromptParams {
  /** 用户当前餐次（用于辅助判断分量） */
  mealType?: string;
  /** 额外上下文（如用户饮食限制） */
  extraContext?: string;
}

/** 食物识别系统提示词 */
export const RECOGNIZE_FOOD_SYSTEM_PROMPT = `你是一个专业的营养识别助手。给定一张食物照片，识别其中的所有食物，并估算每项食物的重量（克）与热量（千卡），以及宏量营养素（碳水/蛋白质/脂肪，单位克）。
要求：
1. 仅返回 JSON，不要任何额外文字或代码块标记。
2. JSON 结构：{"items":[{"name":"","category":1,"weight":0,"calories":0,"carbs":0,"protein":0,"fat":0,"confidence":0.0}],"totalCalories":0}
3. category 取值：1主食 2肉类 3蔬菜 4水果 5乳制品 6饮料 99其他。
4. confidence 取 0-1 之间的小数。
5. 若无法识别，返回 {"items":[],"totalCalories":0}。`;

/** 食物识别用户提示词模板（变量用占位符） */
export const RECOGNIZE_FOOD_USER_PROMPT_TEMPLATE = (params: RecognizeFoodPromptParams): string => {
  const mealLine = params.mealType ? `当前餐次：${params.mealType}。` : '';
  const ctxLine = params.extraContext ? `额外上下文：${params.extraContext}。` : '';
  return `${mealLine}${ctxLine}请识别这张照片中的食物并按指定 JSON 结构返回。`;
};
