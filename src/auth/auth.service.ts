import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // src/auth/auth.service.ts

  // src/auth/auth.service.ts

  async login(dto: any) {
    // 1. ค้นหา User จากอีเมล
    const user = await this.usersService.findOneByEmail(dto.email);
    
    // 🚩 แก้ไขจุดนี้: ใช้ user.passwordHash ให้ตรงกับใน Entity คลาส User
    if (!user || user.passwordHash !== dto.password) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        passwordHash: dto.password,
      },
    };
  }

  async register(dto: any) {
    // ตรวจสอบอีเมลซ้ำ (Optional แต่อนะนำ)
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // ส่งข้อมูลไปสร้าง User ใหม่
    return await this.usersService.create({
      username: dto.username || dto.email.split('@')[0],
      email: dto.email,
      name: dto.name,
      // 🚩 ต้องใช้ชื่อ passwordHash (ตามที่นิยามใน Entity) ไม่ใช่ password_hash
      passwordHash: dto.password, 
    });
  }
}