import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // ต้องมีตัวนี้
import { Repository } from 'typeorm'; // ต้องมีตัวนี้
import { User } from './entities/user.entity'; // ตรวจสอบว่า Path ของไฟล์ Entity ถูกต้อง
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // 1. ต้องฉีด Repository เข้ามาใน Constructor ถึงจะหายแดง
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 2. ฟังก์ชันสร้าง User (Register)
    // src/users/users.service.ts
  async create(userData: any): Promise<User> {
    // 1. สร้าง Instance จาก Repository
    const newUser = this.usersRepository.create(userData as User);
    
    // 2. บันทึกลงฐานข้อมูล Neon
    return await this.usersRepository.save(newUser);
  }

  // 3. ฟังก์ชันหาด้วย Email (สำหรับระบบ Login)
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // 4. ฟังก์ชันหาด้วย ID
  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  // 5. ฟังก์ชันแสดงทั้งหมด
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // 6. ฟังก์ชันอัปเดตข้อมูล
  // src/users/users.service.ts

  async update(id: number, updateData: any): Promise<User> {
    // 1. ตรวจสอบและดึงข้อมูลเดิมมาเตรียมอัปเดต
    const updatedUser = await this.usersRepository.preload({
      id: id,
      ...updateData,
    });

    // 🚩 แก้ไขจุดที่ติดแดง: ตรวจสอบว่า updatedUser มีค่าจริงหรือไม่
    if (!updatedUser) {
      throw new NotFoundException(`ไม่พบผู้ใช้งานไอดี #${id}`);
    }

    // 2. เมื่อมั่นใจว่ามีค่า (ไม่เป็น undefined) ตัวแดงจะหายไปครับ
    return await this.usersRepository.save(updatedUser);
  }

  // 7. ฟังก์ชันลบข้อมูล
  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}