import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { OrderHistory } from './order-history.entity';
import { User } from '../../users/entities/user.entity'; // ปลดคอมเมนต์ถ้าจะเชื่อมกับ User
import { Policy } from './policy.entity';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 20 })
  stock: string;

  @Column({ name: 'bot_type', length: 20, default: 'POLICY' })
  botType: string;

  // ✅ เปลี่ยน Default เป็น PAUSE ตามที่คุณต้องการ
  @Column({ length: 20, default: 'PAUSE' }) 
  status: string;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  backtest: boolean;

  @Column({ name: 'copy_rate', type: 'float', default: 0.0 })
  copyRate: number;

  // ... (พวก app_id, app_secret ถ้าไม่ได้แสดงใน Dashboard จะไม่ใส่ใน Entity ก็ได้ แต่ใส่ไว้ให้ครบดีกว่าครับ)
  @Column({ name: 'app_id', length: 100, nullable: true })
  appId: string;

  @Column({ name: 'broker_id', length: 50, nullable: true })
  brokerId: string;

  @Column({ name: 'account_number', length: 50, nullable: true })
  accountNumber: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // ความสัมพันธ์ 1 Bot มีหลาย OrderHistory
  @OneToMany(() => OrderHistory, orderHistory => orderHistory.bot)
  orderHistories: OrderHistory[];

  @OneToOne(() => Policy, policy => policy.bot)
  policy: Policy;

  // ✅ เพิ่มความสัมพันธ์ Many-to-One กลับมาหา User
  @ManyToOne(() => User, (user) => user.bots)
  @JoinColumn({ name: 'user_id' }) // ต้องชื่อเดียวกับใน DB Studio (user_id)
  user: User;
}