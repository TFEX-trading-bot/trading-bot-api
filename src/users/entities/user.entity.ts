import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Bot } from '../../bots/entities/bot.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Bot, (bot) => bot.user)
  bots: Bot[];
}