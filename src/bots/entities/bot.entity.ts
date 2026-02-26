import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 20 })
  stock: string; // เช่น 'TTBH26'

  @Column({ length: 20, default: 'PAUSED' })
  status: string; // 'RUNNING', 'PAUSED'

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  backtest: boolean;

  @Column({ name: 'copy_rate', type: 'double precision', default: 1.0 })
  copyRate: number;

  @Column({ name: 'app_id', length: 100, nullable: true })
  appId: string;

  @Column({ name: 'app_secret', length: 255, nullable: true })
  appSecret: string;

  @Column({ name: 'broker_id', length: 50, nullable: true })
  brokerId: string;

  @Column({ name: 'app_code', length: 50, nullable: true })
  appCode: string;

  @Column({ name: 'account_number', length: 50, nullable: true })
  accountNumber: string;

  @Column({ name: 'bot_type', length: 20, nullable: true })
  botType: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bots)
  @JoinColumn({ name: 'user_id' })
  user: User;
}