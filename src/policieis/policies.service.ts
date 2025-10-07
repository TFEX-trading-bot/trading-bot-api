import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Policy } from './policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy) private readonly policiesRepo: Repository<Policy>,
  ) {}

  async create(dto: CreatePolicyDto) {
    return this.policiesRepo.save({
      bot: { id: dto.botId } as any,      // หรือ botId: dto.botId ถ้าคอลัมน์มี
      userId: dto.userId,
      symbol: dto.symbol,
      rules: dto.rules ?? [],
      version: 1,
    });
  }

  findOne(id: string) {
    return this.policiesRepo.findOne({
      where: { id },
      relations: { bot: true },           // ถ้าอยากดึง bot มาด้วย
    });
  }

  findAll(filter: { botId?: string; userId?: string }) {
    const where: FindOptionsWhere<Policy> = {};
    if (filter.botId) (where as any).botId = filter.botId; // หรือ where.bot = { id: filter.botId }
    if (filter.userId) (where as any).userId = filter.userId;
    return this.policiesRepo.find({
      where,
      order: { createdAt: 'DESC' as any },
    });
  }
}
