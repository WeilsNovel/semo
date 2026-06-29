/**
 * 请求封装 - 解包 BaseApiResponse，统一处理 code 非0异常
 * 约束：禁止裸返回，所有请求经此封装
 */
import { CURRENT_ENV_CONFIG, REQUEST_TIMEOUT } from '@/config';
import { ERROR_CODE, ERROR_MESSAGE_MAP, type BaseApiResponse } from '@semo/shared';

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
}

/** 从本地存储读取 token（由 storage 封装注入） */
let tokenGetter: (() => string | null) | null = null;

/** 注入 token 获取函数（避免循环依赖） */
export function setTokenGetter(getter: () => string | null): void {
  tokenGetter = getter;
}

/**
 * 统一请求封装
 * @returns 解包后的业务数据 data
 */
export function request<T = unknown>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header, withAuth = true } = options;

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
        const body = res.data as BaseApiResponse<T>;
        if (body && body.code === ERROR_CODE.SUCCESS) {
          resolve(body.data);
          return;
        }
        const message = (body && ERROR_MESSAGE_MAP[body.code]) || ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR];
        uni.showToast({ title: message, icon: 'none' });
        reject(new Error(message));
      },
      fail: (err) => {
        uni.showToast({ title: ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR], icon: 'none' });
        reject(err);
      },
    });
  });
}
