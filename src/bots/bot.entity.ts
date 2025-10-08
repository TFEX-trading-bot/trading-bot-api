import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Policy } from '../policieis/policy.entity'; // <-- ตรวจ path ให้ถูก

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

  @OneToMany(() => Policy, (p) => p.bot)
  policies!: Policy[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
