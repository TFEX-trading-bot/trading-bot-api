import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  account_number: string;

  @OneToMany(() => Bot, (bot) => bot.user)
  bots: Bot[];
}
 
