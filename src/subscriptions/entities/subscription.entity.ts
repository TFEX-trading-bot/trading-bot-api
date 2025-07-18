import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserSubscription } from '../../user-subscriptions/entities/user-subscription.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id_subscription: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration_days: number;

  @Column()
  bot_number: number;

  @Column({ nullable: true })
  time_count: number;

  // Subscription หนึ่งประเภท สามารถมี UserSubscription ได้หลายรายการ
  @OneToMany(() => UserSubscription, (userSub) => userSub.subscription)
  userSubscriptions: UserSubscription[];
}