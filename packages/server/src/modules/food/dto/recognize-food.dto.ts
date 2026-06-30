/**
 * 食物识别 DTO - 字段对齐 shared FoodRecognizeRequest
 * 约束：imageType 限定 base64/url；mealType 可选数字（MEAL_TYPE）
 */
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { FoodRecognizeRequest } from '@semo/shared';

export class RecognizeFoodDto implements FoodRecognizeRequest {
  /** 图片base64（不含 data: 前缀）或图片URL */
  @IsString()
  @IsNotEmpty()
  image: string;

  /** 图片来源标识 */
  @IsIn(['base64', 'url'])
  imageType: 'base64' | 'url';

  /** 餐次（可选，MEAL_TYPE 数值，传给 AI 作分量上下文） */
  @IsOptional()
  @IsInt()
  mealType?: number;
}
