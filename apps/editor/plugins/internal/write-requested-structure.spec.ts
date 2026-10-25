import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { writeRequestedStructure } from './write-requested-structure.ts';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

const createRoot = (): Promise<string> =>
  createLibraryRoot({
    'normal.ts': "import { DR, __ } from './consts';\n",
    'hard.ts': '',
    'vertical.ts': '',
    'library.ts': "import { NORMAL_001 } from './normal';\n",
  });

describe('writeRequestedStructure', () => {
  it('should save the structure and answer with what it saved when the request is sound', async () => {
    const root = await createRoot();

    const answer = await writeRequestedStructure(createStructurePaths(root), {
      name: 'NORMAL_002',
      pool: 'normal',
      text: TEXT,
    });

    expect(answer).toEqual({
      status: 200,
      body: { name: 'NORMAL_002', pool: 'normal', isCreated: true },
    });
    expect(
      await readFile(
        resolve(root, '../../libs/structures/src/lib/normal.ts'),
        'utf8',
      ),
    ).toContain(`export const NORMAL_002: Structure = ${TEXT};`);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should turn the request away without saving when there is no request', async () => {
    const answer = await writeRequestedStructure(
      createStructurePaths('/nowhere/apps/editor'),
      undefined,
    );

    expect(answer).toEqual({
      status: 400,
      body: {
        message: 'a structure needs a NORMAL_nnn or HARD_nnn name and a grid',
      },
    });
  });

  it('should turn the request away without saving when the text is not a structure', async () => {
    const answer = await writeRequestedStructure(
      createStructurePaths('/nowhere/apps/editor'),
      { name: 'NORMAL_002', pool: 'normal', text: 'process.exit(1)' },
    );

    expect(answer).toEqual({
      status: 400,
      body: { message: 'the grid is not a structure literal' },
    });
  });
});
