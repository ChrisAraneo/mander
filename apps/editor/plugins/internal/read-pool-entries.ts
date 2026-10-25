import { map } from 'lodash-es';
import { readFile } from 'node:fs/promises';
import { parseStructures } from '../parse-structures.ts';
import type { LibraryEntry } from '../types/library-entry.ts';
import type { Pool } from '../types/pool.ts';
import type { StructurePaths } from '../types/structure-paths.ts';

export const readPoolEntries = (
  paths: StructurePaths,
  pool: Pool,
): Promise<LibraryEntry[]> =>
  readFile(paths.structures[pool], 'utf8').then((source) =>
    map(parseStructures(source), ({ name, text }): LibraryEntry => ({
      name,
      pool,
      text,
    })),
  );
