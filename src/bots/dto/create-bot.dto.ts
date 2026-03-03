import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBotDto {
  @IsString()
  @IsNotEmpty()
  stock: string;

  @IsNumber()
  @Min(0)
  copyRate: number;
}