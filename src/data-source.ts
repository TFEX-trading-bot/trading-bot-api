// src/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // หรือกรณีแยก field ก็อ่านจาก DB_HOST/DB_PORT...
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
