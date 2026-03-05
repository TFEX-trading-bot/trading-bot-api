import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { BotsModule } from './bots/bots.module';
import { Bot } from './bots/entities/bot.entity';
import { OrderHistory } from './bots/entities/order-history.entity';
import { Policy } from './bots/entities/policy.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Subscription } from './subscriptions/subscription.entity';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentTransaction } from './payments/payment-transaction.entity';

@Module({
  imports: [
    // 1. โหลด ConfigModule เพื่อให้อ่านค่า .env ได้
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Import ScheduleModule to enable Cron Jobs
    ScheduleModule.forRoot(),

    // 2. เชื่อมต่อ Database ผ่าน TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Bot, OrderHistory, Policy, Subscription, PaymentTransaction],
        synchronize: false, 
        ssl: {
          rejectUnauthorized: true, 
        },
      }),
    }),
    
    // 3. ตั้งค่า JWT Module
    JwtModule.register({
      global: true, // ทำให้ JWT Module พร้อมใช้งานในทุก Module โดยไม่ต้อง import ซ้ำ
      secret: 'supersecretkey_change_me_in_production', 
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule, 
    BotsModule,
    SubscriptionsModule,
    UsersModule,
    AuthModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}