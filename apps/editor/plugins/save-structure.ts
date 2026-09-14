import { readFile, writeFile } from 'node:fs/promises';

import { getType, type Pool } from './pool.ts';
import { mergeAliases } from './merge-aliases.ts';
import { registerStructure } from './register-structure.ts';
import type { StructurePaths } from './resolve-structure-paths.ts';
import { upsertStructure } from './upsert-structure.ts';
import { restoreEndings } from './restore-endings.ts';

export interface SavedStructure {
  name: string;
  pool: Pool;
  isCreated: boolean;
}

const register = async (
  path: string,
  name: string,
  pool: Pool,
): Promise<void> => {
  const original = await readFile(path, 'utf8');
  const listed = registerStructure(original, name, pool);

  await writeFile(path, restoreEndings(listed, original), 'utf8');
};

export const saveStructure = async (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<SavedStructure> => {
  const file = paths.structures[pool];
  const original = await readFile(file, 'utf8');
  const { source, isCreated } = upsertStructure(
    mergeAliases(original, text),
    name,
    text,
    getType(pool),
  );

  await writeFile(file, restoreEndings(source, original), 'utf8');
  await register(paths.library, name, pool);

  return { name, pool, isCreated };
};
