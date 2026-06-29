/**
 * 食物模块 controller - 占位骨架
 * 约束：禁止返回裸数据，统一经 ResponseInterceptor 输出 BaseApiResponse
 */
import { Body, Controller, Post } from '@nestjs/common';
import { RecognizeFoodDto } from './dto/recognize-food.dto';

@Controller('food')
export class FoodController {
  @Post('recognize')
  async recognize(@Body() _dto: RecognizeFoodDto): Promise<{ todo: string }> {
    // TODO(技术债): 调用 AI 运行时识别食物，落库为打卡记录
    return { todo: 'food recognize not implemented yet' };
  }
}
