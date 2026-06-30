/**
 * 上传服务 - 图片保存到本地 static/uploads/<scene>/
 * 约束：校验格式/大小，失败抛 FOOD_IMAGE_INVALID；MVP 本地存储，生产换 OSS（留 TODO）
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { ERROR_CODE } from '@semo/shared';
import type { UploadImageResponse } from '@semo/shared';
import { STATIC_CONFIG } from '../../config/constants';
import { UPLOAD_CONFIG } from '../../config/constants';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  /** 保存上传文件并返回可访问 URL */
  async saveImage(
    file: Express.Multer.File,
    scene: 'food' | 'avatar',
    originalName?: string,
  ): Promise<UploadImageResponse> {
    // 校验 MIME
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        code: ERROR_CODE.FOOD_IMAGE_INVALID,
        message: '仅支持 jpeg/png 图片',
      });
    }
    // 校验大小
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      throw new BadRequestException({
        code: ERROR_CODE.FOOD_IMAGE_INVALID,
        message: '图片大小超过限制（5MB）',
      });
    }

    const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
    const savedName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const relPath = `${UPLOAD_CONFIG.subDir}/${scene}/${savedName}`;
    const absPath = join(process.cwd(), STATIC_CONFIG.rootDir, relPath);

    // 确保目录存在
    await mkdir(dirname(absPath), { recursive: true });
    await writeFile(absPath, file.buffer);

    const url = `${STATIC_CONFIG.urlPrefix}/${relPath}`;
    const md5 = createHash('md5').update(file.buffer).digest('hex');
    this.logger.log(`[upload] saved scene=${scene} name=${originalName || '-'} size=${file.size}`);

    // TODO(技术债): 生产环境换 OSS/COS，URL 改为公网可访问
    return { url, size: file.size, md5 };
  }
}
