// src/policieis/codegen/helper.ts
import * as ejs from 'ejs';
import * as fsp from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function renderPolicyPy({
  templatePath,
  data,
  outDir,
  outFile = 'policy.py',
}: {
  templatePath: string;
  data: any;
  outDir: string;
  outFile?: string;
}) {
  const tpl = await fsp.readFile(templatePath, 'utf8');
  const code = ejs.render(tpl, data);

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, outFile);
  await fsp.writeFile(outPath, code, 'utf8');

  return outPath;
}
