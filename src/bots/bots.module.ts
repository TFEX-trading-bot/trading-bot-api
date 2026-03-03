import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot } from './entities/bot.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Policy } from './entities/policy.entity';
import { User } from '../users/entities/user.entity'; // เพิ่มการนำเข้า User เพื่อเชื่อมความสัมพันธ์

@Module({
  // สำคัญมาก! ต้องเอา Entity มาใส่ตรงนี้เพื่อให้ Service เรียกใช้งาน Repository ได้
  imports: [TypeOrmModule.forFeature([Bot, OrderHistory, Policy, User])],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}