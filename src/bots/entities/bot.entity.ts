import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'bots' })
export class Bot {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 200 })
	name: string;

	@Column({ type: 'text', nullable: true })
	config?: string;

	@CreateDateColumn({ type: 'datetime', nullable: true })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'datetime', nullable: true })
	updatedAt?: Date;
}
