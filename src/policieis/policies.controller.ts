// src/policieis/policies.controller.ts
import {
  Controller,
  Post, Body, UsePipes, ValidationPipe,
  Get, Param, Query, // <<< ต้อง import มาด้วย
} from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Controller('policies') // ถ้า main.ts มี globalPrefix('api') แล้ว path จะเป็น /api/policies
export class PoliciesController {
  constructor(private readonly policies: PoliciesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreatePolicyDto) {
    const row = await this.policies.create(dto);
    return { ok: true, id: row.id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.policies.findOne(id);
  }

  @Get()
  async findAll(
    @Query('botId') botId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.policies.findAll({ botId, userId });
  }
}
