/**
 * 请求封装 - 解包 BaseApiResponse，统一处理 code 非0异常
 * 约束：禁止裸返回，所有请求经此封装
 *       useMock=true 时走 core/mock.ts，否则走 uni.request
 */
import { CURRENT_ENV_CONFIG, REQUEST_TIMEOUT } from '@/config';
import { ERROR_CODE, ERROR_MESSAGE_MAP, type BaseApiResponse } from '@semo/shared';
import { executeMock } from '@/core/mock';
import type { MockRouteKey } from '@/types';

/** 请求方法 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** 请求基础参数 */
interface RequestOptions {
  url: string;
  method?: HttpMethod;
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  /** 是否需要鉴权 */
  withAuth?: boolean;
  /** 强制跳过 mock（即使 useMock=true 也走真实接口） */
  forceReal?: boolean;
}

/** 从本地存储读取 token（由 storage 封装注入） */
let tokenGetter: (() => string | null) | null = null;

/** 注入 token 获取函数（避免循环依赖） */
export function setTokenGetter(getter: () => string | null): void {
  tokenGetter = getter;
}

/**
 * 统一处理响应体 - 校验 code，抛出业务异常
 */
function unwrapResponse<T>(body: BaseApiResponse<T>): T {
  if (body && body.code === ERROR_CODE.SUCCESS) {
    return body.data;
  }
  const message = (body && ERROR_MESSAGE_MAP[body.code]) || ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR];
  uni.showToast({ title: message, icon: 'none' });
  throw new Error(message);
}

/**
 * 统一请求封装
 * @returns 解包后的业务数据 data
 */
export function request<T = unknown>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header, withAuth = true, forceReal = false } = options;

  // Mock 分支：useMock=true 且未强制真实接口时走 mock
  if (CURRENT_ENV_CONFIG.useMock && !forceReal) {
    const route: MockRouteKey = { url, method };
    return executeMock<T>(route, data)
      .then((body) => unwrapResponse<T>(body))
      .catch((err: unknown) => {
        // unwrapResponse 内部已 toast，此处仅 reject 上抛
        return Promise.reject(err instanceof Error ? err : new Error(String(err)));
      });
  }

  // 真实接口分支
  const finalHeader: Record<string, string> = {
    'Content-Type': 'application/json',
    ...header,
  };
  if (withAuth && tokenGetter) {
    const token = tokenGetter();
    if (token) finalHeader.Authorization = `Bearer ${token}`;
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${CURRENT_ENV_CONFIG.apiBaseUrl}${url}`,
      method,
      data,
      header: finalHeader,
      timeout: REQUEST_TIMEOUT,
      success: (res) => {
        try {
          const body = res.data as BaseApiResponse<T>;
          resolve(unwrapResponse<T>(body));
        } catch (err) {
          reject(err);
        }
      },
      fail: (err) => {
        uni.showToast({ title: ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR], icon: 'none' });
        reject(err);
      },
    });
  });
}
