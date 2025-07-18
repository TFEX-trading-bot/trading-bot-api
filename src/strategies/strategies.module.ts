// src/strategies/strategies.module.ts
import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Strategy } from './entities/strategy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Strategy])],
  controllers: [StrategiesController],
  providers: [StrategiesService],
})
export class StrategiesModule {}