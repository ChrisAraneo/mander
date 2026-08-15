import { readFile, writeFile } from 'node:fs/promises';

import type { Difficulty } from './difficulty';
import { mergeAliases } from './merge-aliases';
import { registerStructure } from './register-structure';
import type { StructurePaths } from './structure-paths';
import { upsertStructure } from './upsert-structure';
import { withEndings } from './with-endings';

export interface SavedStructure {
  name: string;
  difficulty: Difficulty;
  created: boolean;
}

const register = async (
  path: string,
  name: string,
  difficulty: Difficulty,
): Promise<void> => {
  const original = await readFile(path, 'utf8');
  const listed = registerStructure(original, name, difficulty);

  await writeFile(path, withEndings(listed, original), 'utf8');
};

export const saveStructure = async (
  paths: StructurePaths,
  name: string,
  difficulty: Difficulty,
  text: string,
): Promise<SavedStructure> => {
  const file = paths.structures[difficulty];
  const original = await readFile(file, 'utf8');
  const { source, created } = upsertStructure(
    mergeAliases(original, text),
    name,
    text,
  );

  await writeFile(file, withEndings(source, original), 'utf8');
  await register(paths.library, name, difficulty);

  return { name, difficulty, created };
};
