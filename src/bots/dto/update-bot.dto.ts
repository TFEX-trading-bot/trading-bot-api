import { PartialType } from '@nestjs/mapped-types';
import { CreateBotDto } from './create-bot.dto';

/**
 * Data Transfer Object (DTO) for updating an existing Bot.
 *
 * It extends the CreateBotDto and uses the PartialType utility from NestJS.
 * This makes all fields from CreateBotDto optional, allowing clients to send
 * only the data they intend to update without having to provide all fields.
 *
 * All validation rules from CreateBotDto are automatically inherited and
 * applied only if the field is present in the request payload.
 */
export class UpdateBotDto extends PartialType(CreateBotDto) {}

