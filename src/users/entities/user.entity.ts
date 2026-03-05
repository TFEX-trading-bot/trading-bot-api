import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';
import { Subscription } from '../../subscriptions/subscription.entity';

@Entity({ name: 'users' }) // ชื่อตารางต้องตรงกับ Python (users)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' }) // Map ชื่อ column ให้ตรงกับ Python
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'account_number', nullable: true })
  accountNumber: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Bot, (bot) => bot.user)
  bots: Bot[];

  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ name: 'subscription_end_date', nullable: true })
  subscriptionEndDate: Date;

  @Column({ name: 'subscription_start_date', nullable: true })
  subscriptionStartDate: Date;
}