import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bot } from '../bots/bot.entity';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // FK -> bots.id
  @ManyToOne(() => Bot, (b) => b.policies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bot_id' })
  bot!: Bot;

  // ถ้าอยากเก็บเฉพาะค่า id ก็ทำ field แยกไว้ (หรือจะไม่ใส่ก็ได้ ถ้าใช้ relation ด้านบนตอน save ใส่ { bot: { id: dto.botId } })
  // @Column({ name: 'bot_id', type: 'uuid' })
  // botId!: string;

  // <<< ต้องมี field นี้ให้ตรงกับคอลัมน์ใน DB >>>
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'symbol', type: 'text' })
  symbol!: string;

  @Column({ type: 'jsonb', default: [] })
  rules!: unknown;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
