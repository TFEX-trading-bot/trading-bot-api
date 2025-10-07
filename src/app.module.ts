// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PoliciesModule } from './policieis/policies.module';

import { PolicyEntity } from './common/entities/policy.entity';
import { PolicyVersionEntity } from './common/entities/policy-version.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL')!,
        autoLoadEntities: true,
        synchronize: false, // โปรดคงตามที่ตั้งไว้
      }),
    }),
    PoliciesModule,  // <<<<<< สำคัญ
  ],
})
export class AppModule {}