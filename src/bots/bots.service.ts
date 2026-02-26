import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './entities/bot.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
  ) {}

  // ✅ ปรับให้ดึงข้อมูลโดยอ้างอิงจาก ID ของความสัมพันธ์ user
  async findByUserId(userId: number): Promise<Bot[]> {
    return await this.botsRepository.find({
      where: { 
        user: { id: userId } // TypeORM จะแปลงเป็น "user_id" = userId ให้เองครับ
      },
      order: { id: 'DESC' }
    });
  }

  // ✅ ถ้าจะใช้ userId ตรงๆ ต้องมั่นใจว่าใน Entity มีการนิยาม @Column() userId: number ไว้
  async findAllByUser(userId: number) {
    return this.findByUserId(userId); // เรียกใช้ฟังก์ชันด้านบนแทนเพื่อความแม่นยำ
  }

  async findOne(userId: number, botId: number) {
    // ปรับให้เช็คผ่านความสัมพันธ์ user.id
    const bot = await this.botsRepository.findOne({ 
      where: { 
        id: botId, 
        user: { id: userId } 
      } 
    });
    if (!bot) throw new NotFoundException('Bot not found for this user');
    return bot;
  }

  async updateStatus(userId: number, botId: number, status: string) {
    const bot = await this.findOne(userId, botId);
    bot.status = status;
    return this.botsRepository.save(bot);
  }
}