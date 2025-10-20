import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot } from './entities/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bot])],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}
