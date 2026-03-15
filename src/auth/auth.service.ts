import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { RegisterDto } from './dto/register.dto';

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
  async register(registerDto: RegisterDto) {
    const { name, email, password, role = 'user' } = registerDto;

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

    // BEST PRACTICE: หลีกเลี่ยง Magic Number (ID 1) 
    // หากเป็นไปได้ในอนาคต ควรเปลี่ยนไปใช้ where: { isDefault: true } หรือ where: { name: 'Free' }
    const defaultSub = await this.subscriptionRepository.findOne({ where: { id: 1 } });
    let startDate: Date | null = new Date(); // กำหนดวันที่เริ่มต้นเป็นเวลาปัจจุบันเสมอ
    let endDate: Date | null = null;

    // หากแพ็กเกจมีระยะเวลา (duration > 0) ให้คำนวณวันหมดอายุด้วย
    if (defaultSub && defaultSub.duration > 0) {
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