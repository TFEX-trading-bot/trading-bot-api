import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Indicator } from './indicator.entity';

@Injectable()
export class IndicatorsService {
  constructor(@InjectRepository(Indicator) private repo: Repository<Indicator>) {}

  list() {
    return this.repo.find({ order: { name: 'ASC' } });
  }
}
