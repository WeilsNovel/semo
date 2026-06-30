/**
 * 上传 DTO - multipart 表单字段对齐 shared UploadImageRequest
 * 约束：file 为二进制部分（不在 DTO），scene/filename 为表单字段
 */
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { UploadImageRequest } from '@semo/shared';

export class UploadImageDto implements UploadImageRequest {
  /** 业务场景：food 打卡图 / avatar 头像 */
  @IsString()
  @IsIn(['food', 'avatar'])
  scene: 'food' | 'avatar';

  /** 文件名（可选，用于命名/日志） */
  @IsOptional()
  @IsString()
  filename?: string;
}
