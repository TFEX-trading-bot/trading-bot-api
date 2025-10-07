import { IsInt, IsString, IsOptional, IsIn, IsNumber, IsEnum } from 'class-validator';

export class RuleDto {
  @IsInt()
  priority: number;

  @IsString()
  indicator: string;      // 'RSI' | 'SMA' | 'EMA' | ...

  @IsInt()
  period: number;

  @IsString()
  op: string;             // 'CROSS_ABOVE' | 'CROSS_BELOW' | 'GREATER' | 'LESS' ...

  // value ฝั่งขวา: จะเป็นตัวเลข หรืออ้าง indicator อื่น
  @IsOptional()
  right_type?: 'VALUE' | 'INDICATOR';

  @IsOptional()
  @IsNumber()
  right_value?: number;

  @IsOptional()
  @IsString()
  right_ref?: string;     // ชื่อ indicator ที่อ้างถึง เช่น 'SMA'

  @IsOptional()
  @IsInt()
  right_period?: number;

  @IsString()
  action: 'BUY' | 'SELL' | 'HOLD';
}
