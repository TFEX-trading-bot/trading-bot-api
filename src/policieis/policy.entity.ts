// src/policieis/policy.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { Bot } from '../bots/bot.entity';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn()
  id!: number;                   // <- number ตามที่เราเลือกไว้

  @ManyToOne(() => Bot, (b) => b.policies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bot_id' })   // <<< สำคัญ: map ไปที่คอลัมน์จริงใน DB
  bot!: Bot;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column()
  symbol!: string;

  @Column({ type: 'jsonb' })
  rules!: unknown[];

  @Column({ default: 1 })
  version!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
