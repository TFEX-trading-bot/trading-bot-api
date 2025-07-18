import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';

@Entity('strategies')
export class Strategy {
  @PrimaryGeneratedColumn()
  id_strategy: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  img: string;

  // Strategy หนึ่งอัน สามารถใช้กับ Bot ได้หลายตัว
  @OneToMany(() => Bot, (bot) => bot.strategy)
  bots: Bot[];
}