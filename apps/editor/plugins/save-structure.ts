import { readFile, writeFile } from 'node:fs/promises';

import type { Pool } from './pool.ts';
import { mergeAliases } from './merge-aliases.ts';
import { registerStructure } from './register-structure.ts';
import type { StructurePaths } from './structure-paths.ts';
import { upsertStructure } from './upsert-structure.ts';
import { withEndings } from './with-endings.ts';

export interface SavedStructure {
  name: string;
  pool: Pool;
  created: boolean;
}

const register = async (
  path: string,
  name: string,
  pool: Pool,
): Promise<void> => {
  const original = await readFile(path, 'utf8');
  const listed = registerStructure(original, name, pool);

  await writeFile(path, withEndings(listed, original), 'utf8');
};

export const saveStructure = async (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<SavedStructure> => {
  const file = paths.structures[pool];
  const original = await readFile(file, 'utf8');
  const { source, created } = upsertStructure(
    mergeAliases(original, text),
    name,
    text,
  );

  await writeFile(file, withEndings(source, original), 'utf8');
  await register(paths.library, name, pool);

  return { name, pool, created };
};
