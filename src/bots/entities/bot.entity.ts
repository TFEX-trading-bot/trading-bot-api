import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BotStatus } from '../dto/create-bot.dto';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max_invest: number;

  @Column()
  duration: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  stoploss: number;

  @Column({
    type: 'enum',
    enum: BotStatus,
    default: BotStatus.INACTIVE
  })
  status: BotStatus;

  @Column({ default: false })
  notification: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bots, { nullable: true, onDelete: 'SET NULL' })
  user?: User;
}
