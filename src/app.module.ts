import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    // 1. ต่อ Database (ผ่าน Tunnel Port 5434)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434, // ✅ Port ที่เราทำ SSH Tunnel ไว้
      username: 'admin',
      password: 'mysecretpassword',
      database: 'tradingbot_db',
      entities: [User],
      synchronize: false, // ⚠️ สำคัญ: อย่าเปิด true บน Production เดี๋ยวตารางหาย (ให้ Python จัดการ Schema)
    }),
    TypeOrmModule.forFeature([User]),
    
    // 2. ตั้งค่า JWT Secret (ต้องตรงกับ Python เป๊ะๆ!)
    JwtModule.register({
      secret: 'supersecretkey_change_me_in_production', // 🔑 KEY ต้องตรงกับ Python
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}