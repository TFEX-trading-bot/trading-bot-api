import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PolicyVersionEntity } from './policy-version.entity';

@Entity('policies')
@Index(['botId', 'userId', 'symbol'], { unique: true })
export class PolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'bot_id', type: 'varchar', length: 80 })
  botId!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 80 })
  userId!: string;

  @Column({ name: 'symbol', type: 'varchar', length: 40 })
  symbol!: string;

  @Column({ name: 'rules', type: 'jsonb', default: () => `'[]'::jsonb` })
  rules!: unknown[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;

  // ⬇⬇⬇  เพิ่มอันนี้
  @OneToMany(() => PolicyVersionEntity, (v) => v.policy, {
    cascade: ['insert'],                // จะสร้าง version พร้อม policy ได้
    orphanedRowAction: 'delete',        // ลบ orphan version อัตโนมัติ (ถ้าต้องการ)
  })
  versions!: PolicyVersionEntity[];
}
