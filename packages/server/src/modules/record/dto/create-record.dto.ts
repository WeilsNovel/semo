/**
 * 创建打卡记录 DTO - 字段对齐 shared RecordCreateRequest
 * 约束：items 嵌套校验；recordDate 为 YYYY-MM-DD
 */
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { MEAL_TYPE } from '@semo/shared';
import type { RecordCreateRequest } from '@semo/shared';
import { FoodItemDto } from './food-item.dto';

export class CreateRecordDto implements RecordCreateRequest {
  /** 餐次（MEAL_TYPE 数值） */
  @IsInt()
  @Min(1)
  mealType: (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE];

  /** 食物项数组（嵌套校验） */
  @ValidateNested({ each: true })
  @Type(() => FoodItemDto)
  items: FoodItemDto[];

  /** 该餐总热量 */
  @IsInt()
  @Min(0)
  totalCalories: number;

  /** 打卡图片URL */
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  /** 打卡日期 YYYY-MM-DD */
  @IsDateString()
  recordDate: string;
}
