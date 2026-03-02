import { PartialType } from '@nestjs/mapped-types';
import { CreateBotDto } from './create-bot.dto';

// PartialType จะทำให้ทุก field ใน CreateBotDto กลายเป็น Optional (อัปเดตแค่บางฟิลด์ได้)
export class UpdateBotDto extends PartialType(CreateBotDto) {}