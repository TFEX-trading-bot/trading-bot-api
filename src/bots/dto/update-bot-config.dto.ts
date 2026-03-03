import { IsBoolean, IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// สร้าง Class ย่อยสำหรับ Validate ข้อมูลข้างใน "risk"
class RiskSettingsDto {
  @IsOptional() @IsNumber() risk_pct?: number;
  @IsOptional() @IsString() sl_model?: string;
  @IsOptional() @IsNumber() atr_period?: number;
  @IsOptional() @IsNumber() atr_mult?: number;
  @IsOptional() @IsNumber() rr?: number;
}

export class UpdateBotSettingsDto {
  // สวิตช์เปิด-ปิด Public
  @IsOptional() 
  @IsBoolean() 
  public?: boolean;

  // รับค่า Object "risk"
  @IsOptional()
  @ValidateNested()
  @Type(() => RiskSettingsDto)
  risk?: RiskSettingsDto;
}