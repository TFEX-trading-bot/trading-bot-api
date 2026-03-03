import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

    // 4. บันทึกข้อมูลลงฐานข้อมูล
    const newUser = this.usersRepository.create({
      name,
      email,
      username,
      passwordHash, 
      role,
    });
    await this.usersRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  // ✅ Login: ตรวจสอบสิทธิ์และส่งข้อมูลกลับให้ Frontend
  async login(email: string, password: string) {
    // 1. ตรวจสอบข้อมูลผู้ใช้ในฐานข้อมูลจาก Email
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. เปรียบเทียบ Password ที่ส่งมากับ Hash ในฐานข้อมูล
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. สร้าง JWT Payload (ข้อมูลที่จะฝังอยู่ใน Token)
    const payload = { sub: user.username, user_id: user.id, role: user.role };
    
    // ✅ 4. ส่งข้อมูลกลับไปให้ Frontend (รวมฟิลด์ user_id เพื่อใช้ดึงข้อมูลพอร์ต)
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      name: user.name,
      user_id: user.id // ✨ จุดสำคัญที่จะทำให้ค่าใน LocalStorage ไม่เป็น undefined อีกต่อไป
    };
  }
}