import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('indicators')
export class Indicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  defaultPeriod?: number;
}
