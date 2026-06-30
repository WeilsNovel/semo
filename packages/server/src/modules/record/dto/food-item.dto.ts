/**
 * 食物项 DTO - 用于嵌套校验 CreateRecordDto.items
 * 约束：字段对齐 shared FoodRecognizeItem；category 为 FOOD_CATEGORY 数值
 */
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import type { FoodRecognizeItem } from '@semo/shared';

const CATEGORY_VALUES = [1, 2, 3, 4, 5, 6, 99] as const;

export class FoodItemDto implements FoodRecognizeItem {
  @IsString()
  name: string;

  @IsNumber()
  @IsIn([...CATEGORY_VALUES])
  category: FoodRecognizeItem['category'];

  @IsNumber()
  weight: number;

  @IsNumber()
  calories: number;

  @IsOptional()
  @IsNumber()
  carbs?: number;

  @IsOptional()
  @IsNumber()
  protein?: number;

  @IsOptional()
  @IsNumber()
  fat?: number;

  @IsNumber()
  confidence: number;
}
