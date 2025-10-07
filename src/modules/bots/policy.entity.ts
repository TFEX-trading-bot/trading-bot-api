import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'uuid' })
  botId: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'jsonb' })
  rules: unknown;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
