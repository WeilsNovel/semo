/**
 * 打卡记录服务 - CRUD + 当日统计
 * 约束：落库前校验同餐次重复抛 RECORD_DUPLICATE；分页/聚合走 PG
 *       返回值对齐 shared RecordItem / PageData<RecordItem> / DailyStatResponse
 */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ERROR_CODE,
  MEAL_TYPE,
  RECORD_STATUS,
} from '@semo/shared';
import type {
  DailyStatResponse,
  FoodRecognizeItem,
  PageData,
  RecordItem,
} from '@semo/shared';
import { RecordEntity } from '../../database/entities/record.entity';
import { UserEntity } from '../../database/entities/user.entity';
import type { CreateRecordDto } from './dto/create-record.dto';
import type { ListRecordDto } from './dto/list-record.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity) private readonly recordRepo: Repository<RecordEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  /** 创建打卡记录（同用户同日同餐次重复抛 RECORD_DUPLICATE） */
  async create(userId: number, dto: CreateRecordDto): Promise<RecordItem> {
    const dup = await this.recordRepo.findOneBy({
      userId,
      recordDate: dto.recordDate,
      mealType: dto.mealType,
      status: RECORD_STATUS.NORMAL,
    });
    if (dup) {
      throw new ConflictException({
        code: ERROR_CODE.RECORD_DUPLICATE,
        message: '该餐次今日已打卡',
      });
    }
    const entity = this.recordRepo.create({
      userId,
      mealType: dto.mealType,
      items: dto.items as FoodRecognizeItem[],
      totalCalories: dto.totalCalories,
      imageUrl: dto.imageUrl,
      recordDate: dto.recordDate,
      status: RECORD_STATUS.NORMAL,
    });
    const saved = await this.recordRepo.save(entity);
    return this.toRecordItem(saved);
  }

  /** 分页列表（按日期/餐次筛选） */
  async list(userId: number, dto: ListRecordDto): Promise<PageData<RecordItem>> {
    const qb = this.recordRepo
      .createQueryBuilder('r')
      .where('r.user_id = :userId', { userId })
      .andWhere('r.status = :status', { status: RECORD_STATUS.NORMAL });

    if (dto.startDate) {
      qb.andWhere('r.record_date >= :startDate', { startDate: dto.startDate });
    }
    if (dto.endDate) {
      qb.andWhere('r.record_date <= :endDate', { endDate: dto.endDate });
    }
    if (dto.mealType !== undefined) {
      qb.andWhere('r.meal_type = :mealType', { mealType: dto.mealType });
    }
    qb.orderBy('r.id', 'DESC')
      .skip((dto.pageNum - 1) * dto.pageSize)
      .take(dto.pageSize);

    const [records, total] = await qb.getManyAndCount();
    return {
      list: records.map((r) => this.toRecordItem(r)),
      total,
      pageNum: dto.pageNum,
      pageSize: dto.pageSize,
    };
  }

  /** 当日统计（聚合 totalCalories/recordCount/mealBreakdown） */
  async dailyStat(userId: number, date: string | undefined): Promise<DailyStatResponse> {
    const recordDate = date || this.todayStr();
    const records = await this.recordRepo.findBy({
      userId,
      recordDate,
      status: RECORD_STATUS.NORMAL,
    });

    // 初始化三餐分布（所有 MEAL_TYPE key 归零）
    const mealBreakdown: Record<string, number> = {
      [String(MEAL_TYPE.BREAKFAST)]: 0,
      [String(MEAL_TYPE.LUNCH)]: 0,
      [String(MEAL_TYPE.DINNER)]: 0,
      [String(MEAL_TYPE.SNACK)]: 0,
    };
    let totalCalories = 0;
    for (const r of records) {
      totalCalories += r.totalCalories;
      const key = String(r.mealType);
      mealBreakdown[key] = (mealBreakdown[key] || 0) + r.totalCalories;
    }

    // 目标热量从用户档案取
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ code: ERROR_CODE.NOT_FOUND, message: '用户不存在' });
    }
    const targetCalories = user.targetCalories ?? 0;

    return {
      recordDate,
      totalCalories,
      targetCalories,
      recordCount: records.length,
      mealBreakdown,
    };
  }

  /** 实体 → shared RecordItem（时间戳转 ISO 字符串） */
  private toRecordItem(e: RecordEntity): RecordItem {
    return {
      id: e.id,
      userId: e.userId,
      mealType: e.mealType as RecordItem['mealType'],
      items: e.items,
      totalCalories: e.totalCalories,
      imageUrl: e.imageUrl,
      recordDate: e.recordDate,
      status: e.status as RecordItem['status'],
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }

  /** 服务端本地日期 YYYY-MM-DD（按服务器时区） */
  private todayStr(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
