import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { writeSavedResponse } from './write-saved-response.ts';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

describe('writeSavedResponse', () => {
  it('should save the structure and answer with what it saved when the pool has never seen it', async () => {
    const root = await createLibraryRoot({
      'hard.ts': "import { DR, __ } from './consts';\n",
      'library.ts': '',
    });

    const answer = await writeSavedResponse(
      createStructurePaths(root),
      'HARD_001',
      'hard',
      TEXT,
    );

    expect(answer).toEqual({
      status: 200,
      body: { name: 'HARD_001', pool: 'hard', isCreated: true },
    });
    expect(
      await readFile(
        resolve(root, '../../libs/structures/src/lib/hard.ts'),
        'utf8',
      ),
    ).toContain(`export const HARD_001: Structure = ${TEXT};`);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should fail when the pool file is missing', async () => {
    const root = await createLibraryRoot({ 'library.ts': '' });

    await expect(
      writeSavedResponse(createStructurePaths(root), 'HARD_001', 'hard', TEXT),
    ).rejects.toThrow();

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
