import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: number; // ระยะเวลาของแพ็กเกจ (เช่น จำนวนวัน)

  @Column({ name: 'bot_number', default: 1 })
  botNumber: number;

  @Column({ default: 'monthly' })
  frequency: string; // 'monthly', 'yearly'
}