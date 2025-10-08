import { join } from 'path';
import { existsSync } from 'fs';
import {
  NotFoundException,
  Res,
  Param,
  Get,
  Post,          // ← เพิ่ม
  Body,          // ← เพิ่ม
  Query,         // ← เพิ่ม
  Controller,
  UsePipes,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { Response } from 'express';

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto'; // ← เพิ่ม import DTO

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policies: PoliciesService) {}

  @Get(':botId/policy.py')
  async download(@Param('botId') botId: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'generated', String(botId), 'policy.py');
    if (!existsSync(filePath)) throw new NotFoundException('policy.py not found');
    return res.sendFile(filePath);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {   // << เปลี่ยนเป็น number + ParseIntPipe
    return this.policies.findOne(id);
  }

  @Get()
  findAll(@Query('botId') botId?: string, @Query('userId') userId?: string) {
    return this.policies.findAll({ botId, userId });
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post()
  create(@Body() dto: CreatePolicyDto) {
    console.log(dto)
    return this.policies.create(dto);
  }
}
