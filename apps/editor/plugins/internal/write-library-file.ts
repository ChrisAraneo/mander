import { readFile, writeFile } from 'node:fs/promises';
import { addStructure } from '../add-structure.ts';
import { toOriginalEndings } from '../to-original-endings.ts';
import type { Pool } from '../types/pool.ts';

export const writeLibraryFile = (
  path: string,
  name: string,
  pool: Pool,
): Promise<void> =>
  readFile(path, 'utf8').then((original) =>
    writeFile(
      path,
      toOriginalEndings(addStructure(original, name, pool), original),
      'utf8',
    ),
  );
