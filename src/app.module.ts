import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { BotsModule } from './bots/bots.module';
import { StrategiesModule } from './strategies/strategies.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { UserSubscriptionsModule } from './user-subscriptions/user-subscriptions.module';

@Module({
  imports: [
    // 1. ตั้งค่า ConfigModule ให้อ่านไฟล์ .env ได้ทั่วทั้งโปรเจค
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. ตั้งค่า TypeOrmModule เพื่อเชื่อมต่อ PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // สแกนหาไฟล์ Entity อัตโนมัติ
        synchronize: false, // ตั้งเป็น true เฉพาะตอนพัฒนา, Production ควรเป็น false
      }),
    }),

    UsersModule,

    AdminsModule,

    BotsModule,

    StrategiesModule,

    SubscriptionsModule,

    OrderHistoryModule,

    UserSubscriptionsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}