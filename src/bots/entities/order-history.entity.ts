import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bot } from './bot.entity';

@Entity('order_histories')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bot_id' })
  botId: number;

  @Column({ name: 'order_id', length: 50, nullable: true })
  orderId: string;

  @Column({ name: 'price_at', type: 'decimal', precision: 18, scale: 4 })
  priceAt: number;

  @Column()
  amount: number;

  @Column({ length: 10 })
  action: string; // OPEN LONG, CLOSE SHORT, ฯลฯ

  @Column({ name: 'total_profit', type: 'decimal', precision: 18, scale: 4, default: 0.0 })
  totalProfit: number;

  @CreateDateColumn({ name: 'date_time', type: 'timestamp with time zone' })
  dateTime: Date;

  // ความสัมพันธ์ กลับไปหา Bot
  @ManyToOne(() => Bot, bot => bot.orderHistories)
  @JoinColumn({ name: 'bot_id' })
  bot: Bot;
}