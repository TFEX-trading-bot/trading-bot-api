import { Type } from 'class-transformer';
import {
  IsArray, ValidateNested, IsInt, Min, IsIn, IsNumber,
  IsOptional, IsString, IsUUID
} from 'class-validator';

export class RuleDto {
  @IsInt() priority!: number;

  @IsString() indicator!: string;      // e.g. 'RSI'
  @IsInt() period!: number;            // e.g. 14

  @IsIn(['CROSS_ABOVE','CROSS_BELOW']) op!: 'CROSS_ABOVE' | 'CROSS_BELOW';

  @IsIn(['VALUE','INDICATOR']) right_type!: 'VALUE' | 'INDICATOR';

  @IsNumber() right_value!: number;

  @IsIn(['BUY','SELL']) action!: 'BUY' | 'SELL';
}

export class CreatePolicyDto {
  @IsUUID() botId!: string;

  @IsUUID() userId!: string;

  @IsString() symbol!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleDto)
  rules!: RuleDto[];

  // ถ้าจะส่ง version มาด้วย
  @IsInt()
  @IsOptional()
  version?: number;
}
