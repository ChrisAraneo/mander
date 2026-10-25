import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createLibraryRoot } from '../test/create-library-root.ts';
import { writePoolFile } from './write-pool-file.ts';

const TEXT = '[\n  [\n    [__, CN],\n  ],\n  [],\n]';

const NORMAL =
  "import { DR, __ } from './consts';\r\n\r\nexport const NORMAL_001: Structure = [\r\n  [\r\n    [__, DR],\r\n  ],\r\n  [],\r\n];\r\n";

const createPath = (root: string): string =>
  resolve(root, '../../libs/structures/src/lib/normal.ts');

describe('writePoolFile', () => {
  it('should add the structure and its aliases in the line endings of the file when the pool has never seen it', async () => {
    const root = await createLibraryRoot({ 'normal.ts': NORMAL });

    const isCreated = await writePoolFile(
      createPath(root),
      'NORMAL_002',
      'normal',
      TEXT,
    );

    expect(isCreated).toBe(true);
    expect(await readFile(createPath(root), 'utf8')).toBe(
      "import { DR, __, CN } from './consts';\r\n\r\nexport const NORMAL_001: Structure = [\r\n  [\r\n    [__, DR],\r\n  ],\r\n  [],\r\n];\r\n\r\nexport const NORMAL_002: Structure = [\r\n  [\r\n    [__, CN],\r\n  ],\r\n  [],\r\n];\r\n",
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should rewrite the structure in place when the pool already has it', async () => {
    const root = await createLibraryRoot({ 'normal.ts': NORMAL });

    const isCreated = await writePoolFile(
      createPath(root),
      'NORMAL_001',
      'normal',
      TEXT,
    );

    expect(isCreated).toBe(false);
    expect(await readFile(createPath(root), 'utf8')).toBe(
      "import { DR, __, CN } from './consts';\r\n\r\nexport const NORMAL_001: Structure = [\r\n  [\r\n    [__, CN],\r\n  ],\r\n  [],\r\n];\r\n",
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should add the structure alone when the pool file is empty', async () => {
    const root = await createLibraryRoot({ 'normal.ts': '' });

    await writePoolFile(createPath(root), 'NORMAL_001', 'normal', TEXT);

    expect(await readFile(createPath(root), 'utf8')).toBe(
      `\n\nexport const NORMAL_001: Structure = ${TEXT};\n`,
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
