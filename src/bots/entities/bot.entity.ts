import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Strategy } from '../../strategies/entities/strategy.entity';
import { OrderHistory } from '../../order-history/entities/order-history.entity';
import { BotStatus } from '../enums/bot-status.enum';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn()
  id_bot: number;

  @Column()
  user_id: number;

  @Column()
  strategy_id: number;

  @Column({ length: 100 })
  stock: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  max_invest: number;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  stoploss: number;

  @Column({ type: 'enum', enum: BotStatus, default: BotStatus.INACTIVE })
  status: BotStatus;

  @Column({ default: true })
  notification: boolean;

  @Column({ length: 255, nullable: true })
  broker_id: string;

  @Column({ length: 255, nullable: true })
  account_number: string;

  @Column({ length: 255, nullable: true })
  app_id: string;

  @Column({ type: 'text', nullable: true })
  app_secret: string;

  @Column({ length: 255, nullable: true })
  app_code: string;

  @CreateDateColumn()
  created_at: Date;

  // --- Relationships ---
  // Bot หลายตัว เป็นของ User หนึ่งคน
  @ManyToOne(() => User, (user) => user.bots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Bot หลายตัว ใช้ Strategy หนึ่งอัน
  @ManyToOne(() => Strategy, (strategy) => strategy.bots, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'strategy_id' })
  strategy: Strategy;

  // Bot หนึ่งตัว มีได้หลาย OrderHistory
  @OneToMany(() => OrderHistory, (order) => order.bot)
  order_history: OrderHistory[];
}