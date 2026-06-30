/**
 * 打卡记录模块 - 装配 RecordEntity + UserEntity（取目标热量）
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from '../../database/entities/record.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity, UserEntity])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
