// src/common/entities/bot.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('bots')
export class BotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  user_id: string;

  @Column({ type: 'varchar', length: 32 })
  symbol: string;

  @Column({ type: 'uuid', nullable: true })
  policy_id?: string;

  @Column({ type: 'int', nullable: true })
  policy_version?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
