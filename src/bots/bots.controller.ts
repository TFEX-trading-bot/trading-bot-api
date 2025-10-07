import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BotsService } from './bots.service';

@Controller('bots')
export class BotsController {
  constructor(private readonly svc: BotsService) {}

  @Post()
  create(@Body() dto: any) {          // dto: CreateBotDto (ดูสัญญา API ด้านล่าง)
    return this.svc.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }
}
