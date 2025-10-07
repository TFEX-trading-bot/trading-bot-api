import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PolicyEntity } from './policy.entity';

@Entity('policy_versions')
export class PolicyVersionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PolicyEntity, (p) => p.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policy_id' })
  policy!: PolicyEntity;

  @Column({ name: 'version', type: 'int' })
  version!: number;

  @Column({ name: 'rules', type: 'jsonb', default: () => `'[]'::jsonb` })
  rules!: unknown[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}
