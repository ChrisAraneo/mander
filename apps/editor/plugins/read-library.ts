import { readFile } from 'node:fs/promises';

import { flatten, map } from 'lodash-es';

import { DIFFICULTIES, type Difficulty } from './difficulty';
import { readStructures } from './read-structures';
import type { StructurePaths } from './structure-paths';

export interface LibraryEntry {
  name: string;
  difficulty: Difficulty;
  text: string;
}

const entriesIn = async (
  paths: StructurePaths,
  difficulty: Difficulty,
): Promise<LibraryEntry[]> =>
  map(
    readStructures(await readFile(paths.structures[difficulty], 'utf8')),
    ({ name, text }): LibraryEntry => ({ name, difficulty, text }),
  );

export const readLibrary = async (
  paths: StructurePaths,
): Promise<LibraryEntry[]> =>
  flatten(
    await Promise.all(
      map(DIFFICULTIES, (difficulty) => entriesIn(paths, difficulty)),
    ),
  );
