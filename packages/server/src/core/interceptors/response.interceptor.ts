/**
 * 全局响应拦截器 - 统一输出 BaseApiResponse 结构
 * 约束：禁止 controller 直接返回裸数据
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ERROR_CODE } from '@semo/shared';
import type { BaseApiResponse } from '@semo/shared';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<BaseApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: ERROR_CODE.SUCCESS,
        message: '操作成功',
        data,
        timestamp: Date.now(),
      })),
    );
  }
}
