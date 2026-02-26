import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotsModule } from './bots/bots.module';

@Module({
  imports: [
    // 1. โหลดค่าจาก .env (รวมถึง DATABASE_URL ของ Neon)
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. ตั้งค่า Database แบบรวมศูนย์
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true, // โหลด Entity (User, Bot) ทั้งหมดให้อัตโนมัติ
        synchronize: false, // ปิดไว้ตามที่คุณต้องการเพื่อเลี่ยง Error ข้อมูลเก่าค้าง
        ssl: {
          rejectUnauthorized: false, // สำหรับการเชื่อมต่อ Neon
        },
      }),
    }),

    // 3. นำเข้า Module ย่อย
    AuthModule,
    UsersModule,
    BotsModule,
  ],
  controllers: [], // ย้าย Controller ออกไปไว้ตาม Module ของตัวเอง
  providers: [],
})
export class AppModule {}