import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private jwtService: JwtService,
  ) {}

  // ✅ Register
  async register(name: string, email: string, password: string, role: string = 'user') {
    // 1. เช็ค email ซ้ำ
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const username = email.split('@')[0];

    // ดึงข้อมูล Subscription เริ่มต้น (ID 1) เพื่อคำนวณวันหมดอายุ
    const defaultSub = await this.subscriptionRepository.findOne({ where: { id: 1 } });
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (defaultSub) {
      startDate = new Date();
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + defaultSub.duration);
    }

    const newUser = this.usersRepository.create({
      name,
      email,
      username,
      passwordHash, // TypeORM จะ map ไปที่ column 'password_hash' ให้เองตาม Entity
      role,
      subscription: defaultSub,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
    });
    await this.usersRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  // ✅ ฟังก์ชัน Login (แก้ไขให้ส่ง user_id ออกมาด้วย)
  async login(email: string, password: string) {
    // 1. ตรวจสอบข้อมูลผู้ใช้ในฐานข้อมูล
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. เปรียบเทียบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. สร้าง Token (Payload ต้องตรงกับที่ Python คาดหวัง)
    const payload = { sub: user.username, user_id: user.id, role: user.role };
    
    // ✅ 4. ส่งข้อมูลกลับไปให้ Frontend (รวม user_id)
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      name: user.name,
      user_id: user.id // เพิ่มบรรทัดนี้เพื่อส่งค่า ID จริง (เช่น 4) ไปที่ Frontend
    };
  }
}