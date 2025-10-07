import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 4000);
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true });

  console.log(`API on http://localhost:${process.env.PORT ?? 4000}`);

  
}
bootstrap();
