import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module'; // ✅ นำเข้า UsersModule
import { BotsModule } from './bots/bots.module';
import { Bot } from './bots/entities/bot.entity';
import { OrderHistory } from './bots/entities/order-history.entity';
import { Policy } from './bots/entities/policy.entity';

@Module({
  imports: [
    // 1. โหลด ConfigModule เพื่อให้อ่านค่า .env ได้
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
        entities: [User, Bot, OrderHistory, Policy],
        synchronize: true, 
        ssl: {
          rejectUnauthorized: true, 
        },
      }),
    }),
    
    // ลงทะเบียน Repository หลัก
    TypeOrmModule.forFeature([User, Bot, OrderHistory]), 
    
    // 3. ตั้งค่า JWT Module
    JwtModule.register({
      secret: 'supersecretkey_change_me_in_production', 
      signOptions: { expiresIn: '1h' },
    }), 

    // ✅ 4. ลงทะเบียน Modules ทั้งหมดเพื่อให้ NestJS รู้จัก Routes
    BotsModule,
    UsersModule, // 👈 เพิ่มจุดนี้เพื่อให้ /users/:id ใช้งานได้จริง
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}