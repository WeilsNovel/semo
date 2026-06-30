/**
 * semo 服务端根模块 - 装配 TypeORM/鉴权/拦截器/过滤器/业务模块
 * 约束：DB 配置读 env；synchronize 仅开发环境；entities 显式注册
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { env } from './config';
import { ResponseInterceptor, HttpExceptionFilter, AuthModule } from './core';
import { UserEntity, RecordEntity } from './database';
import { UserModule } from './modules/user';
import { UploadModule } from './modules/upload';
import { FoodModule } from './modules/food';
import { RecordModule } from './modules/record';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.database,
      entities: [UserEntity, RecordEntity],
      // 开发环境自动建表，生产关闭
      synchronize: env.nodeEnv === 'development',
      logging: env.nodeEnv !== 'production',
    }),
    AuthModule,
    UserModule,
    UploadModule,
    FoodModule,
    RecordModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
