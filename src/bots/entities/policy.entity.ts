import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Bot } from './bot.entity';

@Entity('policy') // ให้ชื่อตรงกับตารางใน Database
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bot_id', unique: true })
  botId: number;

  @Column({ type: 'json', default: {} })
  config: any; // เก็บพวก strategy_config (JSON)

  // ความสัมพันธ์ 1-to-1 กลับไปที่ Bot
  @OneToOne(() => Bot, bot => bot.policy)
  @JoinColumn({ name: 'bot_id' })
  bot: Bot;
}