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

  // ✅ Register: สร้างบัญชีผู้ใช้ใหม่
  async register(name: string, email: string, password: string, role: string = 'user') {
    // 1. ตรวจสอบว่า email นี้ถูกใช้งานไปแล้วหรือยัง
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash Password เพื่อความปลอดภัย
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    
    // 3. สร้าง Username เบื้องต้นจาก Email
    const username = email.split('@')[0];

    // ดึงข้อมูล Subscription เริ่มต้น (ID 1) เพื่อคำนวณวันหมดอายุ
    const defaultSub = await this.subscriptionRepository.findOne({ where: { id: 1 } });
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // หากมี Subscription และไม่ใช่ Free Plan (ID 1) ให้คำนวณวันหมดอายุ
    if (defaultSub && defaultSub.id !== 1) {
      startDate = new Date();
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + defaultSub.duration);
    }

    const newUser = this.usersRepository.create({
      name,
      email,
      username,
      passwordHash, 
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
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.username, user_id: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      name: user.name,
      user_id: user.id,
      role: user.role 
    };
  }
}