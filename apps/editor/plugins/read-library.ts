import { readFile } from 'node:fs/promises';

import { flatten, map } from 'lodash-es';

import { POOLS, type Pool } from './pool.ts';
import { readStructures } from './read-structures.ts';
import type { StructurePaths } from './structure-paths.ts';

export interface LibraryEntry {
  name: string;
  pool: Pool;
  text: string;
}

const entriesIn = async (
  paths: StructurePaths,
  pool: Pool,
): Promise<LibraryEntry[]> =>
  map(
    readStructures(await readFile(paths.structures[pool], 'utf8')),
    ({ name, text }): LibraryEntry => ({ name, pool, text }),
  );

export const readLibrary = async (
  paths: StructurePaths,
): Promise<LibraryEntry[]> =>
  flatten(await Promise.all(map(POOLS, (pool) => entriesIn(paths, pool))));
