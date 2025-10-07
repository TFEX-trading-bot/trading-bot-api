import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Policy } from 'src/policieis/policy.entity';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() user_id!: string;           // map กับผู้ใช้ในระบบเว็บ (u1)
  @Column() symbol!: string;            // PTT
  @Column({ default: 'ACTIVE' }) status!: 'ACTIVE' | 'PAUSED' | 'STOPPED';

  @OneToMany(() => Policy, (p) => p.bot) policies!: Policy[];

  @CreateDateColumn({ type: 'timestamptz' }) created_at!: Date;
}
