/**
 * 打卡记录实体 - 对应 shared RecordItem 的 ORM 映射
 * 约束：items 用 jsonb 存识别结果快照；recordDate 为 date 类型（YYYY-MM-DD）
 *       userId 建普通索引（按用户筛选高频）
 */
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';
import type { FoodRecognizeItem } from '@semo/shared';

@Entity('records')
export class RecordEntity extends BaseEntity {
  /** 用户ID */
  @Index()
  @Column({ type: 'int' })
  userId: number;

  /** 餐次（MEAL_TYPE 数值） */
  @Column({ type: 'smallint' })
  mealType: number;

  /** 识别结果快照（食物项数组） */
  @Column({ type: 'jsonb' })
  items: FoodRecognizeItem[];

  /** 该餐总热量(kcal) */
  @Column({ type: 'int' })
  totalCalories: number;

  /** 打卡图片URL */
  @Column({ type: 'varchar', length: 512 })
  imageUrl: string;

  /** 打卡日期 YYYY-MM-DD */
  @Index()
  @Column({ type: 'date' })
  recordDate: string;

  /** 记录状态：1正常 99已删除 */
  @Column({ type: 'smallint', default: 1 })
  status: number;
}
