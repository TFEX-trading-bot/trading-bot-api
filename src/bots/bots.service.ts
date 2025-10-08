import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bot } from './bot.entity';
import { Policy } from 'src/policieis/policy.entity';
// import { K8sService } from '../k8s/k8s.K8sService';

@Injectable()
export class BotsService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Bot) private botsRepo: Repository<Bot>,
    @InjectRepository(Policy) private policiesRepo: Repository<Policy>,
    // private readonly k8s: K8sService,
  ) {}

  async create(dto: any) {
    // 1) สร้างบอท
    const bot = this.botsRepo.create({ userId: dto.userId, symbol: dto.symbol });
    await this.botsRepo.save(bot);

    // 2) บันทึก policy version 1
    const pol = this.policiesRepo.create({ bot, rules: dto.policy.rules, version: 1 });
    await this.policiesRepo.save(pol);

    // 3) สั่ง K8s/Helm ให้ deploy instance bot
    // await this.k8s.deployBot({
    //   botId: bot.id,
    //   userId: dto.userId,
    //   symbol: dto.symbol,
    //   // env ที่ container ต้องใช้ (DATABASE_URL, REDIS_URL, EXCHANGE_TZ ฯลฯ)
    // });

    return { botId: bot.id };
  }

  async get(id: string) {
    return this.botsRepo.findOne({ where: { id }, relations: ['policies'] });
  }
}
