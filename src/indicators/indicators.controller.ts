// indicators.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly db: DataSource) {}

  @Get()
  async list() {
    return this.db.query(`
      SELECT name, description, default_period
      FROM public.indicators
      ORDER BY name
    `);
  }
}
