import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateBotDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  user_id: number;

  @IsNotEmpty({ message: 'Stock symbol is required' })
  @IsString()
  stock: string;

  @IsOptional()
  @IsString()
  bot_type?: string;

  // Frontend จะส่ง PAUSE หรือ RUNNING มา
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsBoolean()
  backtest?: boolean;
}