import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot } from './entities/bot.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Policy } from './entities/policy.entity';

@Module({
  // สำคัญมาก! ต้องเอา Entity มาใส่ตรงนี้เพื่อให้ Service เรียกใช้งาน Repository ได้
  imports: [TypeOrmModule.forFeature([Bot, OrderHistory, Policy])],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}