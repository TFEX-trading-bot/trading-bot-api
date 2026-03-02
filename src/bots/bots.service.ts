import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './entities/bot.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
  ) {}

  async findOneForDashboard(id: number): Promise<any> {
    const bot = await this.botRepository.findOne({ 
      where: { id },
      relations: ['orderHistories', 'policy'] // ต้องเชื่อมเอาประวัติมาคำนวณกำไร
    });

    if (!bot) {
      throw new NotFoundException(`Bot with id ${id} not found`);
    }

    // 1. คำนวณกำไรรวมของบอทตัวนี้จาก OrderHistory
    const totalPnL = bot.orderHistories.reduce(
      (sum, order) => sum + Number(order.totalProfit), 
      0
    );

    // 2. แปลงสถานะให้ตรงกับ Figma (PAUSE / RUNNING)
    let displayStatus = bot.status;
    if (bot.status === 'ACTIVE' || bot.status === 'RUNNING') displayStatus = 'RUNNING';
    if (bot.status === 'STOPPED' || bot.status === 'PAUSE') displayStatus = 'PAUSE';

    // 3. จัด Format ส่งกลับไปให้ Frontend
    return {
      id: bot.id,
      stock: bot.stock,
      status: displayStatus, 
      copyRate: bot.copyRate,
      createdAt: bot.createdAt,
      totalPnL: totalPnL, 
      tradeCount: bot.orderHistories.length,
      history: bot.orderHistories, // ส่งประวัติไปด้วยเผื่อ Frontend เอาไปพล็อตกราฟ
      public: bot.public,
      policy: bot.policy ? bot.policy.config : null
    };
  }
}