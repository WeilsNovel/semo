/**
 * 图片上传接口 - multipart/form-data
 * 契约对齐（mvp-v1 §4）：POST /upload/image
 * 约束：scene 引用 UPLOAD_SCENE，禁止硬编码 'food'/'avatar'
 *       file 为二进制，不走 core/request 的 JSON 封装，单独用 uni.uploadFile
 *       但仍需鉴权 header，并解包 BaseApiResponse<UploadImageResponse>
 */
import { CURRENT_ENV_CONFIG, REQUEST_TIMEOUT } from '@/config';
import {
  ERROR_CODE,
  ERROR_MESSAGE_MAP,
  type BaseApiResponse,
  type UploadImageResponse,
  type UploadImageRequest,
} from '@semo/shared';

/** uni.chooseImage 成功回调的精简类型（避免引入 @dcloudio/types 全量） */
interface ChooseImageSuccessShape {
  tempFilePaths: string[];
  tempFiles?: Array<{ path: string; size: number }>;
}

/** uploadFile 的精简类型 */
interface UploadFileResult {
  data: string;
  statusCode: number;
}

/** token 注入（与 core/request 共用同一 tokenGetter） */
let uploadTokenGetter: (() => string | null) | null = null;

/** 注入 token 获取函数（由 store/user 在启动时调用） */
export function setUploadTokenGetter(getter: () => string | null): void {
  uploadTokenGetter = getter;
}

/** 构造鉴权 header */
function buildAuthHeader(): Record<string, string> {
  const header: Record<string, string> = {};
  if (uploadTokenGetter) {
    const token = uploadTokenGetter();
    if (token) header.Authorization = `Bearer ${token}`;
  }
  return header;
}

/** 解包 uploadFile 的 string 响应体 */
function unwrapUploadResponse(body: BaseApiResponse<UploadImageResponse>): UploadImageResponse {
  if (body && body.code === ERROR_CODE.SUCCESS) {
    return body.data;
  }
  const message = (body && ERROR_MESSAGE_MAP[body.code]) || ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR];
  uni.showToast({ title: message, icon: 'none' });
  throw new Error(message);
}

/**
 * 上传图片
 * @param file uni.chooseImage 的成功结果
 * @param scene UPLOAD_SCENE 值（food / avatar）
 * @param filename 可选文件名
 * @returns UploadImageResponse（含 url/size/md5）
 */
export function uploadImage(
  file: ChooseImageSuccessShape,
  scene: UploadImageRequest['scene'],
  filename?: string,
): Promise<UploadImageResponse> {
  const tempPath = file.tempFilePaths[0] ?? '';
  if (!tempPath) {
    return Promise.reject(new Error(ERROR_MESSAGE_MAP[ERROR_CODE.FOOD_IMAGE_INVALID]));
  }

  // Mock 分支
  if (CURRENT_ENV_CONFIG.useMock) {
    // 延迟 import 避免循环依赖，直接动态调 mock
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return import('@/core/mock').then(({ executeMock }) => {
      const route = { url: '/upload/image', method: 'POST' as const };
      return executeMock<UploadImageResponse>(route, {
        scene,
        filename: filename ?? tempPath,
      }).then((body) => unwrapUploadResponse(body));
    });
  }

  // 真实接口分支 - uni.uploadFile multipart
  return new Promise<UploadImageResponse>((resolve, reject) => {
    const uploadFile = (uni as unknown as {
      uploadFile: (opts: {
        url: string;
        filePath: string;
        name: string;
        formData?: Record<string, string>;
        header?: Record<string, string>;
        timeout?: number;
        success?: (res: UploadFileResult) => void;
        fail?: (err: unknown) => void;
      }) => void;
    }).uploadFile;

    uploadFile({
      url: `${CURRENT_ENV_CONFIG.apiBaseUrl}/upload/image`,
      filePath: tempPath,
      name: 'file',
      formData: {
        scene,
        ...(filename ? { filename } : {}),
      },
      header: buildAuthHeader(),
      timeout: REQUEST_TIMEOUT,
      success: (res) => {
        try {
          const body = JSON.parse(res.data) as BaseApiResponse<UploadImageResponse>;
          resolve(unwrapUploadResponse(body));
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
