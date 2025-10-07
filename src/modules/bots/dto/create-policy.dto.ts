// src/policies/dto/create-policy.dto.ts
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePolicyDto {
  @IsString() @IsNotEmpty()
  botId!: string;

  @IsString() @IsNotEmpty()
  userId!: string;

  @IsString() @IsNotEmpty()
  symbol!: string;

  @IsArray()
  rules!: any[];  // ถ้าจะเข้มงวด ค่อยทำ RuleDto ภายหลัง
}
