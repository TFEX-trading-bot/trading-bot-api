import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderHistory } from './order-history.entity';
// import { Policy } from './policy.entity';

export enum BotMode {
  MARKET = 'market',
  BACKTEST = 'backtest',
}

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stock: string;

  @Column({ name: 'app_id' })
  app_id: string;

  @Column({ name: 'app_secret' })
  app_secret: string;

  @Column({ name: 'broker_id' })
  broker_id: string;

  @Column({ name: 'account_number' })
  account_number: string;

  @Column({ name: 'app_code' })
  app_code: string;

  @Column({ name: 'id_strategy' })
  id_strategy: number;

  // New: visibility flag (private/public)
  @Column({ name: 'is_private', default: false })
  is_private: boolean;

  // New: mode - market or backtest
  @Column({ type: 'enum', enum: BotMode, default: BotMode.MARKET })
  mode: BotMode;

  // New: how many times the bot has been copy-traded
  @Column({ name: 'copy_count', type: 'int', default: 0 })
  copy_count: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @OneToMany(() => OrderHistory, (oh) => oh.bot, { cascade: true })
  orderHistory?: OrderHistory[];

  // @OneToMany(() => Policy, (p) => p.bot, { cascade: true })
  // policies?: Policy[];

  @ManyToOne(() => User, (user) => user.bots, { nullable: true, onDelete: 'SET NULL' })
  user?: User;
}
