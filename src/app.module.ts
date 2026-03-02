import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './users/entities/user.entity';
import { BotsModule } from './bots/bots.module';
import { Bot } from './bots/entities/bot.entity';
import { OrderHistory } from './bots/entities/order-history.entity';
import { Policy } from './bots/entities/policy.entity';

@Module({
  imports: [
    // 1. โหลด ConfigModule เพื่อให้อ่านค่า .env ได้ (เช่น DATABASE_URL)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. เชื่อมต่อ Database ผ่าน TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Bot, OrderHistory, Policy], // ลงทะเบียน Entity ทั้งหมดที่ใช้ในโปรเจค
        synchronize: true, // สร้างตารางอัตโนมัติ (ปิดเมื่อใช้ Migration จริงจัง)
        ssl: {
          rejectUnauthorized: true, // บังคับตรวจสอบ Certificate (เทียบเท่า verify-full)
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Bot, OrderHistory]), // ลงทะเบียน User Repository ให้ AuthService เรียกใช้ได้
    
    // 3. ตั้งค่า JWT Secret (ต้องตรงกับ Python เป๊ะๆ!)
    JwtModule.register({
      secret: 'supersecretkey_change_me_in_production', // 🔑 KEY ต้องตรงกับ Python
      signOptions: { expiresIn: '1h' },
    }), BotsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}