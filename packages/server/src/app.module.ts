/**
 * semo 服务端根模块 - 装配全局拦截器/过滤器/业务模块
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor, HttpExceptionFilter } from './core';
import { FoodModule } from './modules/food';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FoodModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
