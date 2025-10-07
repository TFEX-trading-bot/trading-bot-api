import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export const INDICATOR = ['RSI','SMA','EMA'] as const;
export const OPERATOR  = ['GT','GE','LT','LE','CROSS_UP','CROSS_DOWN'] as const;
export const ACTION    = ['BUY','SELL','HOLD'] as const;

class ConditionDto {
  @IsString() indicator: string; // 'VALUE' หรือชื่อ indicator
  @IsOptional() @IsInt() period?: number;
  // กรณี VALUE ให้ส่งผ่าน field value ที่ rules ด้านนอก
}

class RuleDto {
  @IsInt() priority: number;
  @IsIn(INDICATOR) indicator: string;
  @IsInt() period: number;

  @IsIn(OPERATOR) op: string;

  // right: could be 'VALUE' with 'value' หรือ 'INDICATOR' with 'rightRef'
  @IsOptional() @IsInt() value?: number;

  @IsOptional() @ValidateNested() @Type(() => ConditionDto)
  right?: ConditionDto;

  @IsIn(ACTION) action: string;

  @IsOptional() @ValidateNested({ each: true }) @Type(() => RuleDto)
  and?: RuleDto[];

  @IsOptional() @ValidateNested({ each: true }) @Type(() => RuleDto)
  or?: RuleDto[];
}

export class CreateBotPayload {
  @IsString() botId: string;
  @IsString() userId: string;
  @IsString() symbol: string;

  @IsArray() @ValidateNested({ each: true }) @Type(() => RuleDto)
  rules: RuleDto[];
}
