/**
 * semo 服务端入口
 * 约束：端口从 env 读取，禁止硬编码；静态资源挂载 /static
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { env, CORS_CONFIG, SERVER_CONFIG, STATIC_CONFIG } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(CORS_CONFIG);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // 静态资源：暴露 packages/server/static/* 为 /static/*
  app.useStaticAssets(join(process.cwd(), STATIC_CONFIG.rootDir), {
    prefix: `${STATIC_CONFIG.urlPrefix}/`,
  });
  await app.listen(env.port || SERVER_CONFIG.port);
  // eslint-disable-next-line no-console
  console.log(`[semo-server] running on http://localhost:${env.port}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[semo-server] bootstrap failed', err);
  process.exit(1);
});
