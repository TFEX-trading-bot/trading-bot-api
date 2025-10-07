import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('indicators')
export class IndicatorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, unique: true }) // <-- NOT NULL + UNIQUE (สอดคล้องกับ DB)
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'int', name: 'default_period', default: 14 })
  defaultPeriod: number;
}
