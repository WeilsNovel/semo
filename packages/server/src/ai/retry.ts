/**
 * AI 重试/限流 - 失败重试与降级
 * 约束：重试次数从 @semo/ai 配置读取，禁止硬编码
 */
import { DEFAULT_AI_PARAMS } from '@semo/ai';

/**
 * 带重试的执行器
 * @param task 业务任务
 * @param retryTimes 重试次数（默认从配置读取）
 */
export async function withRetry<T>(task: () => Promise<T>, retryTimes: number = DEFAULT_AI_PARAMS.retryTimes): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retryTimes; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (attempt === retryTimes) break;
      // 指数退避：2^attempt * 200ms
      const delay = Math.pow(2, attempt) * 200;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
