import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { readPoolEntries } from './read-pool-entries.ts';

const TEXT = '[\n  [__, DR],\n]';

describe('readPoolEntries', () => {
  it('should give every structure of the pool file tagged with the pool when the file declares some', async () => {
    const root = await createLibraryRoot({
      'hard.ts': `export const HARD_001: Structure = ${TEXT};\nexport const HARD_002: Structure = ${TEXT};\n`,
    });

    const entries = await readPoolEntries(createStructurePaths(root), 'hard');

    expect(entries).toEqual([
      { name: 'HARD_001', pool: 'hard', text: TEXT },
      { name: 'HARD_002', pool: 'hard', text: TEXT },
    ]);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should give no structures when the pool file is empty', async () => {
    const root = await createLibraryRoot({ 'hard.ts': '' });

    const entries = await readPoolEntries(createStructurePaths(root), 'hard');

    expect(entries).toEqual([]);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should fail when the pool file is missing', async () => {
    const root = await createLibraryRoot({});

    await expect(
      readPoolEntries(createStructurePaths(root), 'hard'),
    ).rejects.toThrow();

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
