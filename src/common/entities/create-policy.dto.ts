// src/policies/dto/create-policy.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Action, Operator, RightType, Indicator } from '../../common/types/policy.types';

class RightDto {
  @IsIn(['VALUE', 'INDICATOR'])
  type: RightType;

  @IsOptional()
  value?: number;

  @IsOptional()
  indicator?: Indicator;

  @IsOptional()
  @IsInt()
  period?: number;
}

class ConditionDto {
  @IsString()
  indicator: Indicator;

  @IsOptional()
  @IsInt()
  period?: number;

  @IsIn(['CROSS_ABOVE', 'CROSS_BELOW', 'GREATER', 'LESS', 'GE', 'LE'])
  op: Operator;

  @ValidateNested()
  @Type(() => RightDto)
  right: RightDto;

  @IsIn(['BUY', 'SELL', 'HOLD'])
  action: Action;

  @IsOptional() @ValidateNested({ each: true }) @Type(() => ConditionDto) @IsArray()
  and?: ConditionDto[];

  @IsOptional() @ValidateNested({ each: true }) @Type(() => ConditionDto) @IsArray()
  or?: ConditionDto[];
}

export class CreatePolicyDto {
  @IsString()
  botId: string;

  @IsString()
  symbol: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  rules: ConditionDto[];
}
