// src/admins/admins.module.ts
import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import TypeOrmModule
import { Admin } from './entities/admin.entity';   // 2. Import Admin Entity

@Module({
  imports: [TypeOrmModule.forFeature([Admin])], // 3. เพิ่มบรรทัดนี้
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}