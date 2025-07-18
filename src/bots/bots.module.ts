// src/bots/bots.module.ts
import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import TypeOrmModule
import { Bot } from './entities/bot.entity';     // 2. Import Bot Entity

@Module({
  imports: [TypeOrmModule.forFeature([Bot])],   // 3. เพิ่มบรรทัดนี้
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}