import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { BotsService } from './bots.service';
import { UpdateBotSettingsDto } from './dto/update-bot-config.dto';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  // ดึงข้อมูลบอท 1 ตัว พร้อมคำนวณกำไรและแปลงสถานะ PAUSE/RUNNING
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOneForDashboard(+id);
  }

  @Put(':id')
  updateSettings(
    @Param('id') id: string, 
    @Body() updateSettingsDto: UpdateBotSettingsDto
  ) {
    return this.botsService.updateBotSettings(+id, updateSettingsDto);
  }

  // ✅ เพิ่ม Endpoint นี้เพื่อให้Aดึงบอทตามรายคนได้
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.botsService.findAllByUser(+userId);
  }
}