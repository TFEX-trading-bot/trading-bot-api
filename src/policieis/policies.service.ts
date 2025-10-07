// src/policieis/policies.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './policy.entity';
import { Bot } from '../bots/bot.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Bot) private readonly botsRepo: Repository<Bot>,
    @InjectRepository(Policy) private readonly policiesRepo: Repository<Policy>,
  ) {}

  async create(dto: CreatePolicyDto) {
    return this.policiesRepo.save({
      // ถ้า entity ของคุณมีเฉพาะคอลัมน์ botId / userId (ไม่ใช้ relation)
      botId: dto.botId,
      userId: dto.userId,
      symbol: dto.symbol,
      rules: dto.rules ?? [],
      version: 1,
    });
  }

  async findOne(id: string) {
    return this.policiesRepo.findOne({
      where: { id },
      // ถ้าไม่ได้ใช้ relation ไม่ต้องใส่ relations
      // relations: { bot: true },
    });
  }

  async findAll(filter: { botId?: string; userId?: string }) {
    const where: any = {};
    if (filter.botId) where.botId = filter.botId;
    if (filter.userId) where.userId = filter.userId;

    return this.policiesRepo.find({
      where,
      order: { createdAt: 'DESC' },
      // relations: { bot: true }, // ใส่เฉพาะกรณีมี relation จริง
    });
  }
}
