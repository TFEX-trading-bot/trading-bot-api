import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot } from './entities/bot.entity';
import { AuthModule } from '../auth/auth.module'; // <--- เพิ่มการ Import นี้

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot]), 
    AuthModule, // <--- เพิ่มบรรทัดนี้เพื่อให้ BotsModule รู้จัก JwtService และใช้ Guard ได้
  ],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}