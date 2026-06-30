/**
 * 上传 controller - POST /upload/image（multipart/form-data，需鉴权）
 * 约束：用 FileInterceptor 接收 file；scene/filename 走表单字段 DTO
 *       缺少 file 抛 FOOD_IMAGE_INVALID
 */
import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ERROR_CODE } from '@semo/shared';
import { UploadService } from './upload.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { JwtAuthGuard, CurrentUser } from '../../core';
import type { AuthedUser } from '../../types';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UploadImageDto,
    @CurrentUser() _user: AuthedUser,
  ) {
    if (!file) {
      throw new BadRequestException({
        code: ERROR_CODE.FOOD_IMAGE_INVALID,
        message: '缺少上传文件 file',
      });
    }
    return this.uploadService.saveImage(file, dto.scene, dto.filename);
  }
}
