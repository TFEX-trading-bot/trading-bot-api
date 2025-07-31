import { IsString, IsNotEmpty, IsNumber, IsPositive, IsBoolean, IsOptional, IsEnum,} from 'class-validator';
import { Type } from 'class-transformer';

// A simple enum for the bot's status.
// You can customize this based on your application's needs.
export enum BotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

/**
 * Data Transfer Object (DTO) for creating a new Bot.
 * It contains all the necessary fields and validation rules
 * based on the provided ER diagram.
 */
export class CreateBotDto {
  @IsString({ message: 'Stock must be a string.' })
  @IsNotEmpty({ message: 'Stock cannot be empty.' })
  stock: string;

  @IsString({ message: 'App ID must be a string.' })
  @IsNotEmpty({ message: 'App ID cannot be empty.' })
  app_id: string;

  @IsString({ message: 'App Secret must be a string.' })
  @IsNotEmpty({ message: 'App Secret cannot be empty.' })
  app_secret: string;

  @IsString({ message: 'Broker ID must be a string.' })
  @IsNotEmpty({ message: 'Broker ID cannot be empty.' })
  broker_id: string;

  @IsString({ message: 'Account Number must be a string.' })
  @IsNotEmpty({ message: 'Account Number cannot be empty.' })
  account_number: string;

  @IsString({ message: 'App Code must be a string.' })
  @IsNotEmpty({ message: 'App Code cannot be empty.' })
  app_code: string;

  // Assuming id_strategy is a numeric identifier.
  // If it's a UUID string, you can change the validator to @IsUUID().
  @IsNumber({}, { message: 'Strategy ID must be a number.' })
  @IsPositive({ message: 'Strategy ID must be a positive number.' })
  @Type(() => Number) // Automatically transform incoming value to a number
  id_strategy: number;

  @IsNumber({}, { message: 'Max Invest must be a number.' })
  @IsPositive({ message: 'Max Invest must be a positive number.' })
  @Type(() => Number)
  max_invest: number;

  @IsNumber({}, { message: 'Duration must be a number.' })
  @IsPositive({ message: 'Duration must be a positive integer.' })
  @Type(() => Number)
  duration: number;

  // Stoploss is often a percentage or a price point.
  @IsNumber({}, { message: 'Stoploss must be a number.' })
  @IsPositive({ message: 'Stoploss must be a positive number.' })
  @Type(() => Number)
  stoploss: number;

  // Status is optional on creation and can have a default value in the service.
  @IsOptional()
  @IsEnum(BotStatus, { message: 'Status must be one of the following: active, inactive, paused.' })
  status?: BotStatus = BotStatus.INACTIVE;

  @IsBoolean({ message: 'Notification must be a boolean value (true or false).' })
  @Type(() => Boolean)
  notification: boolean;
}
