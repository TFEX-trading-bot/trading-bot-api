import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { Bot } from './entities/bot.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
  ) {}

  async create(createBotDto: CreateBotDto) {
    const bot = this.botRepository.create(createBotDto as Partial<Bot>);
    return this.botRepository.save(bot);
  }

  async findAll(): Promise<Bot[]> {
    return this.botRepository.find();
  }

  async findOne(id: number): Promise<Bot> {
    const bot = await this.botRepository.findOne({ where: { id } });
    if (!bot) throw new NotFoundException(`Bot with id ${id} not found`);
    return bot;
  }

  async update(id: number, updateBotDto: UpdateBotDto): Promise<Bot> {
    const bot = await this.findOne(id);
    const merged = this.botRepository.merge(bot, updateBotDto as Partial<Bot>);
    return this.botRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const res = await this.botRepository.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`Bot with id ${id} not found`);
  }
}
