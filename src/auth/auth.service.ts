import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ✅ Register
  async register(name: string, email: string, password: string) {
    // 1. เช็ค email ซ้ำ
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash Password (ให้ตรงกับ Python Passlib)
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    
    // 3. สร้าง Username จาก Email
    const username = email.split('@')[0];

    // 4. Save ลง DB
    const newUser = this.usersRepository.create({
      name,
      email,
      username,
      passwordHash, // NestJS จะ map ไปลง column password_hash อัตโนมัติ
    });

    await this.usersRepository.save(newUser);
    return { message: 'User registered successfully' };
  }

  // ✅ Login
  async login(email: string, password: string) {
    // 1. หา User
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. เช็ค Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. สร้าง Token (Payload ต้องตรงกับที่ Python คาดหวัง)
    const payload = { sub: user.username, user_id: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      name: user.name
    };
  }
}