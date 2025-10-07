// src/common/types/policy.types.ts
export type Indicator = 'RSI' | 'SMA' | 'EMA' | string;

export type Operator =
  | 'CROSS_ABOVE'
  | 'CROSS_BELOW'
  | 'GREATER'
  | 'LESS'
  | 'GE'
  | 'LE';

export type RightType = 'VALUE' | 'INDICATOR';

export type Action = 'BUY' | 'SELL' | 'HOLD';

export interface RuleDto {
  priority: number;
  indicator: Indicator;
  period?: number;
  op: Operator;
  right_type: RightType;
  right_value?: number;
  right_ref?: Indicator;
  right_period?: number;
  action: Action;
  and?: RuleDto[];
  or?: RuleDto[];
}

export interface CreatePolicyDto {
  botId: string;
  symbol: string;
  rules: RuleDto[];
}
