import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BotsService } from './bots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/user/:userId/bots')
@UseGuards(JwtAuthGuard)
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get('user/:userId')
  async getMyBots(@Param('userId') userId: string) {
    return await this.botsService.findByUserId(+userId);
  }
  @Get()
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.botsService.findAllByUser(userId);
  }

  @Get(':botId')
  findOne(@Param('userId', ParseIntPipe) userId: number, @Param('botId', ParseIntPipe) botId: number) {
    return this.botsService.findOne(userId, botId);
  }

  @Patch(':botId/running')
  async start(@Param('userId', ParseIntPipe) userId: number, @Param('botId', ParseIntPipe) botId: number) {
    return this.botsService.updateStatus(userId, botId, 'RUNNING');
  }

  @Patch(':botId/pause')
  async pause(@Param('userId', ParseIntPipe) userId: number, @Param('botId', ParseIntPipe) botId: number) {
    return this.botsService.updateStatus(userId, botId, 'PAUSED');
  }

  @Get(':botId/configuration')
  async getConfig(@Param('userId', ParseIntPipe) userId: number, @Param('botId', ParseIntPipe) botId: number) {
    // ส่งข้อมูล credentials และการตั้งค่ากลับไป
    const bot = await this.botsService.findOne(userId, botId);
    return {
      appId: bot.appId,
      brokerId: bot.brokerId,
      stock: bot.stock,
      copyRate: bot.copyRate,
      botType: bot.botType
    };
  }
}