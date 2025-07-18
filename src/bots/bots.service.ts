import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './entities/bot.entity';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
  ) {}

  create(createBotDto: CreateBotDto): Promise<Bot> {
    const bot = this.botsRepository.create(createBotDto);
    return this.botsRepository.save(bot);
  }

  findAll(): Promise<Bot[]> {
    return this.botsRepository.find({ relations: ['user', 'strategy'] });
  }

  async findOne(id: number): Promise<Bot> {
    const bot = await this.botsRepository.findOne({
      where: { id_bot: id },
      relations: ['user', 'strategy', 'order_history'],
    });
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    return bot;
  }

  async update(id: number, updateBotDto: UpdateBotDto): Promise<Bot> {
    const bot = await this.botsRepository.preload({
      id_bot: id,
      ...updateBotDto,
    });
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    return this.botsRepository.save(bot);
  }

  async remove(id: number): Promise<void> {
    const result = await this.botsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
  }
}