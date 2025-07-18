import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';
import { OrderAction } from '../enums/order-action.enum';

@Entity('order_history')
export class OrderHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  order_id: string; // TypeORM จะ map bigint เป็น string เพื่อความปลอดภัย

  @Column()
  bot_id: number;

  @Column({ type: 'enum', enum: OrderAction })
  action: OrderAction;

  @Column({ type: 'numeric', precision: 20, scale: 8 })
  amount: number;

  @Column({ type: 'numeric', precision: 20, scale: 8 })
  price_at: number;

  @Column({ type: 'numeric', precision: 15, scale: 4, nullable: true })
  total_profit: number;

  @CreateDateColumn()
  date_time: Date;

  // --- Relationship ---
  // OrderHistory หลายรายการ เป็นของ Bot หนึ่งตัว
  @ManyToOne(() => Bot, (bot) => bot.order_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bot_id' })
  bot: Bot;
}