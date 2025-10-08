// // src/policieis/policies.service.ts
// import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, FindOptionsWhere } from 'typeorm';
// import { join, resolve } from 'path';
// import { existsSync } from 'fs';
// import { Policy } from './policy.entity';
// import { CreatePolicyDto } from './dto/create-policy.dto';
// import { renderPolicyPy } from './codegen/helper';

// @Injectable()
// export class PoliciesService {
//   private readonly logger = new Logger(PoliciesService.name);
//   constructor(
//     @InjectRepository(Policy) private readonly policiesRepo: Repository<Policy>,
//   ) {}

//   /** หาเวอร์ชันล่าสุดของบอท แล้ว +1 */
//   private async nextVersion(botId: string): Promise<number> {
//     const row = await this.policiesRepo
//       .createQueryBuilder('p')
//       .select('MAX(p.version)', 'max')
//       .where('p.bot_id = :botId', { botId })
//       .getRawOne<{ max: number | null }>();

//     return (row?.max ?? 0) + 1;
//   }

//   async create(dto: CreatePolicyDto) {
//     const symbol = dto.symbol?.trim() ?? '';
//     const botId  = String(dto.botId);
//     const userId = String(dto.userId);

//     try {
//       // 1) upsert: หา record เดิมจาก (botId,userId,symbol)
//       const exist = await this.policiesRepo.findOne({
//         where: { userId, symbol, bot: { id: botId } },
//         relations: { bot: true },
//       });

//       let saved: Policy;

//       if (exist) {
//         exist.rules   = dto.rules ?? [];
//         exist.version = (exist.version ?? 0) + 1;
//         saved = await this.policiesRepo.save(exist);
//       } else {
//         const entity = this.policiesRepo.create({
//           bot: { id: botId } as any,
//           userId,
//           symbol,
//           rules: dto.rules ?? [],
//           version: 1,
//         });
//         saved = await this.policiesRepo.save(entity);
//       }

//       // 2) generate policy.py (ใช้ path แบบ absolute ให้แน่ชัด)
//       await this.generatePy(saved);

//       return { ok: true, id: saved.id, version: saved.version, updated: !!exist };
//     } catch (e: any) {
//       // log ดูให้รู้ชัดก่อน
//       console.error('[PoliciesService.create] error:', {
//         name: e?.name,
//         code: e?.code,          // pg error code เช่น 23505
//         detail: e?.detail,
//         message: e?.message,
//         where: e?.where,
//       });

//       // กันเคส unique ซ้ำ
//       if (e?.code === '23505') {
//         throw new ConflictException('Policy for this (botId,userId,symbol) already exists.');
//       }

//       // กัน error อื่นๆ
//       throw new BadRequestException(e?.message ?? 'Failed to create policy');
//     }
//   }

//   private async generatePy(row: Policy) {
//     // path ใน build (dist)
//     const distTpl = resolve(__dirname, 'codegen', 'python.template.ejs');
//     // path ใน dev (ts-node)
//     const srcTpl  = resolve(process.cwd(), 'src', 'policieis', 'codegen', 'python.template.ejs');

//     const templatePath = existsSync(distTpl) ? distTpl : srcTpl;

//     console.log('[generatePy] template picked:', templatePath);

//     if (!existsSync(templatePath)) {
//         throw new Error(`Template not found at ${templatePath}`);
//     }

//     const outDir = resolve(process.cwd(), 'generated', String(row.bot?.id ?? row.bot));
//     const data   = {
//         botId: String(row.bot?.id ?? row.bot),
//         userId: row.userId,
//         symbol: row.symbol,
//         version: row.version ?? 1,
//         rules: row.rules ?? [],
//     };

//     await renderPolicyPy({ templatePath, data, outDir });
//   }

//   async findOne(id: number) {
//     const where: FindOptionsWhere<Policy> = { id };
//     return this.policiesRepo.findOne({ where, relations: { bot: true } });
//   }

//   findAll(filter: { botId?: string; userId?: string }) {
//     const where: FindOptionsWhere<Policy> = {};
//     if (filter?.botId) (where as any).bot = { id: filter.botId };
//     if (filter?.userId) (where as any).userId = filter.userId;
//     return this.policiesRepo.find({ where, order: { createdAt: 'DESC' } as any });
//   }
// }
// src/policieis/policies.service.ts
// src/policieis/policies.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { join } from 'path';
import { Policy } from './policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { renderPolicyPy } from './codegen/helper';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger(PoliciesService.name);

  constructor(
    @InjectRepository(Policy) private readonly policiesRepo: Repository<Policy>,
  ) {}

  async create(dto: CreatePolicyDto) {
    this.logger.debug(`[create] dto = ${JSON.stringify(dto)}`);

    const toSave: Partial<Policy> = {
      bot: { id: dto.botId } as any,
      userId: dto.userId,
      symbol: dto.symbol?.trim(),
      rules: dto.rules ?? [],
      version: 1,
    };
    this.logger.debug(`[create] toSave = ${JSON.stringify(toSave)}`);

    // 1) พยายาม insert ก่อน
    let row: Policy;
    try {
      row = await this.policiesRepo.save(toSave as any);
      this.logger.debug(`[create] inserted id=${row.id}`);
    } catch (e: any) {
      // 2) ถ้าชน unique (23505) → อัปเดตเรคคอร์ดเดิมแทน
      if (e?.code === '23505') {
        this.logger.warn('[create] duplicate detected → update existing');

        const where: FindOptionsWhere<Policy> = {
          userId: dto.userId,
          symbol: dto.symbol?.trim(),
          // relation filter ต้องห่อด้วย object id
          ...(dto.botId ? ({ bot: { id: dto.botId } } as any) : {}),
        };

        const existing = await this.policiesRepo.findOne({ where });
        if (!existing) {
          // เผื่อ race condition หาไม่เจอจริง ๆ
          throw e;
        }

        existing.rules = dto.rules ?? [];
        existing.version = (existing.version ?? 0) + 1;

        row = await this.policiesRepo.save(existing);
        this.logger.debug(`[create] updated id=${row.id} version=${row.version}`);
      } else {
        // error อื่นโยนต่อ
        throw e;
      }
    }

    // 3) generate policy.py (fail แล้วแปลงเป็น 400 + log)
    const templatePath = join(
      process.cwd(),
      'src', 'policieis', 'codegen', 'python.template.ejs',
    );
    const outDir = join(process.cwd(), 'generated', String(dto.botId));
    const data = {
      botId: dto.botId,
      userId: dto.userId,
      symbol: dto.symbol?.trim(),
      version: row.version,
      rules: row.rules ?? [],
      generatedAt: new Date().toISOString(),
    };

    this.logger.debug(`[create] templatePath=${templatePath}`);
    this.logger.debug(`[create] outDir=${outDir}`);
    this.logger.debug(`[create] data(for ejs)=${JSON.stringify(data)}`);

    try {
      const outPath = await renderPolicyPy({ templatePath, data, outDir });
      this.logger.log(`[create] generated file: ${outPath}`);
    } catch (err: any) {
      this.logger.error(`[create] generate error`, err?.stack || err);
      throw new BadRequestException(
        err?.message || 'failed to render policy.py',
      );
    }

    return row; // controller จะส่ง 201/200 ตามที่ตั้งไว้
  }

  async findOne(id: number) {
    const where: FindOptionsWhere<Policy> = { id };
    return this.policiesRepo.findOne({ where, relations: { bot: true } });
  }

  findAll(filter: { botId?: string; userId?: string }) {
    const where: FindOptionsWhere<Policy> = {};
    if (filter?.botId) (where as any).bot = { id: filter.botId };
    if (filter?.userId) (where as any).userId = filter.userId;
    return this.policiesRepo.find({ where, order: { createdAt: 'DESC' } as any });
  }
}
