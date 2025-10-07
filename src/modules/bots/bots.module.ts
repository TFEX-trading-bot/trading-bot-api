import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './bot.entity';
import { Policy } from './policy.entity';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bot, Policy])],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}
