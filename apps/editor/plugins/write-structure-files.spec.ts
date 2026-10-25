import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from './create-structure-paths.ts';
import { createLibraryRoot } from './test/create-library-root.ts';
import { writeStructureFiles } from './write-structure-files.ts';

const TEXT = '[\n  [\n    [__, CN],\n  ],\n  [],\n]';

const NORMAL = `import { DR, __ } from './consts';\r
import type { Structure } from './structure';\r
\r
export const NORMAL_001: Structure = [\r
  [\r
    [__, DR],\r
  ],\r
  [],\r
];\r
`;

const LIBRARY = `import { values } from 'lodash-es';

import { NORMAL_001 } from './normal';
import type { Structure } from './structure';

export const NORMAL_LIBRARY = Object.freeze({
  NORMAL_001,
});

export const NORMAL_STRUCTURES: readonly Structure[] = Object.freeze(
  values(NORMAL_LIBRARY),
);
`;

const createRoot = (): Promise<string> =>
  createLibraryRoot({
    'normal.ts': NORMAL,
    'hard.ts': '',
    'vertical.ts': '',
    'library.ts': LIBRARY,
  });

const readLibraryFile = (root: string, file: string): Promise<string> =>
  readFile(resolve(root, '../../libs/structures/src/lib', file), 'utf8');

describe('writeStructureFiles', () => {
  it('should add the structure to its pool file in the line endings the file already uses when the pool has never seen it', async () => {
    const root = await createRoot();

    const saved = await writeStructureFiles(
      createStructurePaths(root),
      'NORMAL_002',
      'normal',
      TEXT,
    );

    expect(saved).toEqual({
      name: 'NORMAL_002',
      pool: 'normal',
      isCreated: true,
    });
    expect(await readLibraryFile(root, 'normal.ts')).toBe(
      `import { DR, __, CN } from './consts';\r
import type { Structure } from './structure';\r
\r
export const NORMAL_001: Structure = [\r
  [\r
    [__, DR],\r
  ],\r
  [],\r
];\r
\r
export const NORMAL_002: Structure = [\r
  [\r
    [__, CN],\r
  ],\r
  [],\r
];\r
`,
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should import the structure into the library and deal it into its pool when it is new', async () => {
    const root = await createRoot();

    await writeStructureFiles(
      createStructurePaths(root),
      'NORMAL_002',
      'normal',
      TEXT,
    );

    expect(await readLibraryFile(root, 'library.ts')).toBe(
      `import { values } from 'lodash-es';

import { NORMAL_001, NORMAL_002 } from './normal';
import type { Structure } from './structure';

export const NORMAL_LIBRARY = Object.freeze({
  NORMAL_001,
  NORMAL_002,
});

export const NORMAL_STRUCTURES: readonly Structure[] = Object.freeze(
  values(NORMAL_LIBRARY),
);
`,
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should rewrite the structure and leave the library alone when the pool already has it', async () => {
    const root = await createRoot();

    const saved = await writeStructureFiles(
      createStructurePaths(root),
      'NORMAL_001',
      'normal',
      TEXT,
    );

    expect(saved.isCreated).toBe(false);
    expect(await readLibraryFile(root, 'normal.ts')).toContain(
      'export const NORMAL_001: Structure = [\r\n  [\r\n    [__, CN],\r\n  ],\r\n  [],\r\n];\r\n',
    );
    expect(await readLibraryFile(root, 'library.ts')).toBe(LIBRARY);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
