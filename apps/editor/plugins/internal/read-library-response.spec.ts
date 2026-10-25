import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { readLibraryResponse } from './read-library-response.ts';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

describe('readLibraryResponse', () => {
  it('should answer with the whole library when the pool files hold structures', async () => {
    const root = await createLibraryRoot({
      'normal.ts': `export const NORMAL_001: Structure = ${TEXT};\n`,
      'hard.ts': '',
      'vertical.ts': '',
    });

    const answer = await readLibraryResponse(createStructurePaths(root));

    expect(answer).toEqual({
      status: 200,
      body: [{ name: 'NORMAL_001', pool: 'normal', text: TEXT }],
    });

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should answer with an empty library when the pool files are empty', async () => {
    const root = await createLibraryRoot({
      'normal.ts': '',
      'hard.ts': '',
      'vertical.ts': '',
    });

    const answer = await readLibraryResponse(createStructurePaths(root));

    expect(answer).toEqual({ status: 200, body: [] });

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
