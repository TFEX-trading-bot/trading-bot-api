import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bot } from './bot.entity';

@Entity('order_history')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'executed_at' })
  executedAt: Date;

  @ManyToOne(() => Bot, (bot) => bot.orderHistory, { onDelete: 'CASCADE' })
  bot: Bot;
}
