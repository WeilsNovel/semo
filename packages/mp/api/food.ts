/**
 * 食物识别接口 - 引用 shared 类型，禁止前端单独定义
 */
import { request } from '@/core/request';
import type { FoodRecognizeRequest, FoodRecognizeResponse } from '@semo/shared';

/** 食物识别 */
export function recognizeFood(req: FoodRecognizeRequest): Promise<FoodRecognizeResponse> {
  return request<FoodRecognizeResponse>({
    url: '/food/recognize',
    method: 'POST',
    data: req as unknown as Record<string, unknown>,
  });
}
