import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean, IsDateString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Bot number must be at least 1.' })
  botNumber: number;

  @IsBoolean()
  is_backtest: boolean;

  @IsBoolean()
  is_ai: boolean;

  @IsNumber()
  @Min(1)
  duration: number; // ระยะเวลา (เช่น จำนวนวัน)
}