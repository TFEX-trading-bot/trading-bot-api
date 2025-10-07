import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './bot.entity';
import { Policy } from './policy.entity';
import { CreateBotPayload } from './dto/create-bot.dto';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot) private bots: Repository<Bot>,
    @InjectRepository(Policy) private policies: Repository<Policy>,
  ) {}

  async createOrUpdatePolicy(input: CreateBotPayload) {
    // upsert bot
    let bot = await this.bots.findOne({ where: { id: input.botId }});
    if (!bot) {
      bot = this.bots.create({ id: input.botId, userId: input.userId, symbol: input.symbol });
      await this.bots.save(bot);
    } else {
      // ถ้าจำเป็น อัปเดต symbol/userId ด้วย
      bot.symbol = input.symbol;
      await this.bots.save(bot);
    }

    // version ล่าสุด
    const last = await this.policies.findOne({
      where: { botId: bot.id },
      order: { version: 'DESC' },
    });
    const nextVersion = (last?.version ?? 0) + 1;

    const pol = this.policies.create({
      botId: bot.id,
      version: nextVersion,
      rules: input.rules, // เก็บ JSON ตามที่ UI normalize มาแล้ว
    });
    await this.policies.save(pol);

    return { botId: bot.id, version: nextVersion };
  }
}
