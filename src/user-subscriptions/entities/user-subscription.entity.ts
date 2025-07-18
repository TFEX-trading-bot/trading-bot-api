import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  subscription_id: number;

  @CreateDateColumn()
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  // --- Relationships ---
  @ManyToOne(() => User, (user) => user.userSubscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Subscription, (sub) => sub.userSubscriptions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;
}