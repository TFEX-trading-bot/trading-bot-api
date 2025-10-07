import { Controller, Get, Post, Param, Query, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Controller('policies') // เส้นทางจริงคือ /api/policies เพราะเราตั้ง globalPrefix('api')
export class PoliciesController {
  constructor(private readonly policies: PoliciesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreatePolicyDto) {
    const row = await this.policies.create(dto);
    return { ok: true, id: row.id };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // ต้อง return จาก service (อย่า return 1 หรืออย่าลืม return)
    return this.policies.findOne(id); // +id ให้เป็น number
  }

  @Get()
  findAll(@Query('botId') botId?: string, @Query('userId') userId?: string) {
    return this.policies.findAll({ botId, userId });
  }
}
