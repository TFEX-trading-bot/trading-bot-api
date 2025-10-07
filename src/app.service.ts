// // src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PoliciesModule } from './policieis/policies.module';
// import { PolicyEntity } from './common/entities/policy.entity';
// import { PolicyVersionEntity } from './common/entities/policy-version.entity';
// import { IndicatorEntity } from './common/entities/indicator.entity';
// import { BotEntity } from './common/entities/bot.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: process.env.DATABASE_URL, // หรือ host/port/user/pass/db
//       entities: [PolicyEntity, PolicyVersionEntity, IndicatorEntity, BotEntity],
//       synchronize: true, // แนะนำใช้ migration ใน production
//     }),
//     PoliciesModule,
//   ],
// })
// export class AppModule {}

// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'OK';
  }
}
