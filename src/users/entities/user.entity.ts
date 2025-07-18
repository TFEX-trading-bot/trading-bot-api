import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';
import { UserSubscription } from '../../user-subscriptions/entities/user-subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  // User หนึ่งคน สามารถมี Bot ได้หลายตัว
  @OneToMany(() => Bot, (bot) => bot.user)
  bots: Bot[];

  // User หนึ่งคน สามารถมี UserSubscription ได้หลายรายการ
  @OneToMany(() => UserSubscription, (userSub) => userSub.user)
  userSubscriptions: UserSubscription[];
}