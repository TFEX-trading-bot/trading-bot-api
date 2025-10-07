// src/modules/bots/bot.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Policy } from 'src/policieis/policy.entity';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'app_code' })
  appCode!: string;

  @Column()
  symbol!: string;

  @Column({ default: 'draft' })
  status!: string; // หรือ enum ที่คุณมี

  @OneToMany(() => Policy, (p) => p.bot)   // ← ไม่มี @JoinColumn ที่นี่
  policies!: Policy[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
