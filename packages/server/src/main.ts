/**
 * semo 服务端入口
 * 约束：端口从 env 读取，禁止硬编码
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { env, CORS_CONFIG, SERVER_CONFIG } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_CONFIG);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(env.port || SERVER_CONFIG.port);
  // eslint-disable-next-line no-console
  console.log(`[semo-server] running on http://localhost:${env.port}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[semo-server] bootstrap failed', err);
  process.exit(1);
});
