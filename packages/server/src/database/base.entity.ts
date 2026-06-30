/**
 * 实体基类 - 主键 + 时间戳
 * 约束：所有业务实体继承此类；主键生成策略统一由数据库自增
 */
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  /** 自增主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 创建时间（DB 自动写入，读取为 Date） */
  @CreateDateColumn()
  createdAt: Date;

  /** 更新时间（DB 自动更新） */
  @UpdateDateColumn()
  updatedAt: Date;
}
