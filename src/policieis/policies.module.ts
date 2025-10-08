// src/policieis/policies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';

// เส้นทางให้ตรงกับไฟล์จริงของโปรเจกต์คุณ
import { Policy } from './policy.entity';
import { Bot } from '../bots/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, Bot])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
