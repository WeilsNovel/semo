/**
 * 用户实体 - 对应 shared UserItem 的 ORM 映射
 * 约束：字段与 shared UserItem 业务字段对齐；时间戳由 BaseEntity 提供
 *       openid 为登录锚点，唯一索引
 */
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  /** 微信 openid（登录锚点） */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  openid: string;

  /** 昵称 */
  @Column({ type: 'varchar', length: 64, default: '' })
  nickname: string;

  /** 头像URL */
  @Column({ type: 'varchar', length: 512, default: '' })
  avatar: string;

  /** 性别：0未知 1男 2女 */
  @Column({ type: 'smallint', default: 0 })
  gender: 0 | 1 | 2;

  /** 年龄 */
  @Column({ type: 'int', nullable: true })
  age: number | null;

  /** 身高(cm) */
  @Column({ type: 'int', nullable: true })
  height: number | null;

  /** 体重(kg) */
  @Column({ type: 'int', nullable: true })
  weight: number | null;

  /** 目标每日摄入卡路里 */
  @Column({ type: 'int', nullable: true })
  targetCalories: number | null;

  /** 用户状态：1启用 0禁用 */
  @Column({ type: 'smallint', default: 1 })
  status: number;
}
