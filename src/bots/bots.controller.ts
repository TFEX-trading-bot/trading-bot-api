import { Controller, Get, Param } from '@nestjs/common';
import { BotsService } from './bots.service';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  // ดึงข้อมูลบอท 1 ตัว พร้อมคำนวณกำไรและแปลงสถานะ PAUSE/RUNNING
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOneForDashboard(+id);
  }
}