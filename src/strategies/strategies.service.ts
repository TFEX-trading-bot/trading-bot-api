import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy } from './entities/strategy.entity';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectRepository(Strategy)
    private strategiesRepository: Repository<Strategy>,
  ) {}

  create(createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    const strategy = this.strategiesRepository.create(createStrategyDto);
    return this.strategiesRepository.save(strategy);
  }

  findAll(): Promise<Strategy[]> {
    return this.strategiesRepository.find();
  }

  async findOne(id: number): Promise<Strategy> {
    const strategy = await this.strategiesRepository.findOneBy({ id_strategy: id });
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return strategy;
  }

  async update(id: number, updateStrategyDto: UpdateStrategyDto): Promise<Strategy> {
    const strategy = await this.strategiesRepository.preload({
      id_strategy: id,
      ...updateStrategyDto,
    });
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return this.strategiesRepository.save(strategy);
  }

  async remove(id: number): Promise<void> {
    const result = await this.strategiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
  }
}