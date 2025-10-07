// bots.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

type Operator = 'CROSS_ABOVE'|'CROSS_BELOW'|'GREATER'|'LESS'|'GE'|'LE';
type Action   = 'BUY'|'SELL'|'HOLD';

type RuleDto = {
  priority: number;
  indicator: string;         // e.g. 'RSI' | 'SMA' | ...
  period?: number;           // e.g. 14
  op: Operator;
  right: {                   // ค่าเปรียบเทียบ
    type: 'VALUE' | 'INDICATOR';
    value?: number;
    indicator?: string;
    period?: number;
  };
  action: Action;
  and?: RuleDto[];
  or?: RuleDto[];
};

export class CreateBotPayload {
  botId: string;
  userId: string;
  symbol: string;
  rules: RuleDto[];
}

@Controller('bots')
export class BotsController {
  constructor(private readonly db: DataSource) {}

  @Post()
  async createOrUpdate(@Body() payload: CreateBotPayload) {
    // คำนวณ next version
    const [{ next_version }] = await this.db.query(
      `SELECT COALESCE(MAX(version),0)+1 AS next_version
       FROM public.policies WHERE bot_id = $1`,
      [payload.botId]
    );

    // บันทึก policy
    await this.db.query(
      `INSERT INTO public.policies(bot_id,user_id,symbol,version,rules)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        payload.botId,
        payload.userId,
        payload.symbol,
        next_version,
        JSON.stringify({ rules: payload.rules }),
      ],
    );

    return { botId: payload.botId, version: next_version };
  }
}
