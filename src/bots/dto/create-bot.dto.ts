import { BotStatus } from "../enums/bot-status.enum";

export class CreateBotDto {
  user_id: number;
  strategy_id: number;
  stock: string;
  max_invest: number;
  stoploss?: number;
  status?: BotStatus;
  notification?: boolean;
  broker_id?: string;
  account_number?: string;
  app_id?: string;
  app_secret?: string;
  app_code?: string;
}