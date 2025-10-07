// src/policies/dto/create-policy.dto.ts
// import { IsArray, IsString } from 'class-validator';

// export class CreatePolicyDto {
//   @IsString() botId!: string;
//   @IsString() userId!: string;
//   @IsString() symbol!: string;

//   @IsArray()
//   rules!: any[]; // ใช้ any ไปก่อน เดี๋ยวค่อยทำ schema ตามจริง
// }

// src/policies/dtos/create-policy.dto.ts


// import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';
// import { RuleDto } from './rule.dto';
// export class CreatePolicyDto {
//   @IsUUID()
//   botId!: string;

//   @IsString()
//   userId!: string;

//   @IsString()
//   symbol!: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => RuleDto)
//   rules!: RuleDto[];
// }


// create-policy.dto.ts
import { IsUUID, IsString, IsArray, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class CreatePolicyDto {
  @IsUUID() botId: string;
  @IsUUID() userId: string;
  @IsString() symbol: string;

  @IsArray() rules: Array<{
    priority: number;
    indicator: string;
    period: number;
    op: 'CROSS_ABOVE' | 'CROSS_BELOW';
    right_type: 'VALUE' | 'INDICATOR';
    right_value?: number;
    action: 'BUY' | 'SELL';
  }>;
}
