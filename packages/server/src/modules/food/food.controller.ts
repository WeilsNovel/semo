/**
 * 食物 controller - POST /food/recognize（需鉴权）
 * 约束：仅识别不落库；直接返回 data，由 ResponseInterceptor 包裹
 */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { RecognizeFoodDto } from './dto/recognize-food.dto';
import { JwtAuthGuard, CurrentUser } from '../../core';
import type { AuthedUser } from '../../types';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('recognize')
  @UseGuards(JwtAuthGuard)
  async recognize(@Body() dto: RecognizeFoodDto, @CurrentUser() _user: AuthedUser) {
    return this.foodService.recognize(dto);
  }
}
