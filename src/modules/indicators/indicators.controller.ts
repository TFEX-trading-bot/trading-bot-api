import { Controller, Get } from '@nestjs/common';

@Controller('indicators')
export class IndicatorsController {
  @Get()
  findAll() {
    return [
      { name: 'RSI', description: 'Relative Strength Index', defaultPeriod: 14 },
      { name: 'SMA', description: 'Simple Moving Average', defaultPeriod: 14 },
      { name: 'EMA', description: 'Exponential Moving Average', defaultPeriod: 14 },
    ];
  }
}
