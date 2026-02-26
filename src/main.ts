import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- เพิ่มโค้ดส่วนนี้เข้าไป ---
  app.enableCors({
    origin: 'http://localhost:3000', // URL ของหน้าเว็บ Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -------------------------

  await app.listen(3001); // มั่นใจว่าใช้ Port 3001 ตามที่ตั้งใน api.ts ของหน้าบ้าน
}
bootstrap();