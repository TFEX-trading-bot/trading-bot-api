import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot } from './entities/bot.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bot]), UsersModule],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}
