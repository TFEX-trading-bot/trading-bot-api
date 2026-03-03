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


  async findAllByUser(userId: number): Promise<any[]> {
    const bots = await this.botRepository.find({
      where: { user: { id: userId } },
      relations: ['orderHistories'], // ✅ ต้องดึงประวัติการเทรดมาด้วย
      order: { id: 'DESC' }
    });

    return bots.map(bot => {
      // 1. คำนวณกำไรรวม (Total Profit) จาก OrderHistory
      const totalPnL = bot.orderHistories.reduce(
        (sum, order) => sum + Number(order.totalProfit), 
        0
      );

      // 2. คำนวณ % กำไร (ตัวอย่าง: เทียบกับจำนวนเงินตั้งต้น หรือใช้ค่าสะสม)
      // ในที่นี้จะส่งค่า totalPnL ไปเป็น string format สำหรับ Change
      const change = totalPnL >= 0 ? `+${totalPnL.toFixed(2)}` : `${totalPnL.toFixed(2)}`;
      
      // สมมติฐาน: การคำนวณ % อาจต้องมีทุนตั้งต้น แต่ในเบื้องต้นส่งค่าดิบไปก่อน
      const changePct = `${((totalPnL / 100) * 100).toFixed(2)}%`; 

      return {
        ...bot,
        change: change,
        changePct: changePct,
        totalPnL: totalPnL
      };
    });
  }
}
