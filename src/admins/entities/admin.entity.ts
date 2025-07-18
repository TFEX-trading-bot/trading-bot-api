import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id_admin: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, select: false }) // select: false เพื่อไม่ให้ดึงรหัสผ่านไปแสดงโดยอัตโนมัติ
  password: string;
}