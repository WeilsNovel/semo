/**
 * 图片上传契约 - 前后端共享
 * 约束：前端通过 multipart/form-data 上传，服务端返回 URL 后用于 /food/recognize 或头像
 *       file 为二进制部分（不在 JSON body），scene/filename 为表单字段
 */
import type { UPLOAD_SCENE } from '../constants/business';

/** 图片上传入参（multipart/form-data 字段约定） */
export interface UploadImageRequest {
  /** 业务场景：food 打卡图 / avatar 头像 */
  scene: (typeof UPLOAD_SCENE)[keyof typeof UPLOAD_SCENE];
  /** 文件名（可选，用于服务端命名/日志） */
  filename?: string;
}

/** 图片上传响应 */
export interface UploadImageResponse {
  /** 图片访问URL（用于 /food/recognize 的 image 字段，imageType='url'） */
  url: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件MD5（可选，用于前端去重判断） */
  md5?: string;
}
