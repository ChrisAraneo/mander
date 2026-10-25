import { flatten, map } from 'lodash-es';
import { POOLS } from './consts.ts';
import { readPoolEntries } from './internal/read-pool-entries.ts';
import type { LibraryEntry } from './types/library-entry.ts';
import type { StructurePaths } from './types/structure-paths.ts';

export const readLibrary = (paths: StructurePaths): Promise<LibraryEntry[]> =>
  Promise.all(map(POOLS, (pool) => readPoolEntries(paths, pool))).then(
    (entries) => flatten(entries),
  );
