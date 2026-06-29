/**
 * 食物识别 DTO - 字段必须与 @semo/shared 的 FoodRecognizeRequest 完全一致
 * 约束：字段名/类型/可选性对齐，禁止前端单独定义
 */
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RecognizeFoodDto {
  /** 图片base64 或 URL */
  @IsString()
  image: string;

  /** 图片来源标识 */
  @IsEnum(['base64', 'url'])
  imageType: 'base64' | 'url';

  /** 餐次（可选） */
  @IsOptional()
  @IsString()
  mealType?: number;
}
