import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubscribeDto {
  @IsNumber()
  @IsNotEmpty()
  subscriptionId: number;
}