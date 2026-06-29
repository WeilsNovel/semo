/**
 * 全局异常过滤器 - 把异常转换为 BaseApiResponse 结构
 * 约束：抛错使用共享错误码，禁止硬编码数字
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODE } from '@semo/shared';
import type { BaseApiResponse } from '@semo/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ERROR_CODE.SERVER_ERROR;
    let message = '服务器异常，请稍后重试';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const r = res as { code?: number; message?: string };
        if (typeof r.code === 'number') code = r.code;
        if (typeof r.message === 'string') message = r.message;
      }
    }

    this.logger.error(`[semo-server] code=${code} message=${message}`, exception as Error);

    const body: BaseApiResponse = {
      code,
      message,
      data: null,
      timestamp: Date.now(),
    };
    response.status(status).json(body);
  }
}
