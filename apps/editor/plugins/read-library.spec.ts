import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from './create-structure-paths.ts';
import { readLibrary } from './read-library.ts';
import { createLibraryRoot } from './test/create-library-root.ts';

const TEXT = '[\n  [__, DR],\n]';

const formatDeclaration = (name: string, type = 'Structure'): string =>
  `export const ${name}: ${type} = ${TEXT};\n`;

describe('readLibrary', () => {
  it('should give every structure tagged with its pool when each pool file declares some', async () => {
    const root = await createLibraryRoot({
      'normal.ts': `${formatDeclaration('NORMAL_001')}\n${formatDeclaration('NORMAL_002')}`,
      'hard.ts': formatDeclaration('HARD_001'),
      'vertical.ts': formatDeclaration('VERTICAL_001', 'VerticalStructure'),
    });

    const library = await readLibrary(createStructurePaths(root));

    expect(library).toEqual([
      { name: 'NORMAL_001', pool: 'normal', text: TEXT },
      { name: 'NORMAL_002', pool: 'normal', text: TEXT },
      { name: 'HARD_001', pool: 'hard', text: TEXT },
      { name: 'VERTICAL_001', pool: 'vertical', text: TEXT },
    ]);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should give no structures when the pool files are empty', async () => {
    const root = await createLibraryRoot({
      'normal.ts': '',
      'hard.ts': '',
      'vertical.ts': '',
    });

    const library = await readLibrary(createStructurePaths(root));

    expect(library).toEqual([]);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should fail when a pool file is missing', async () => {
    const root = await createLibraryRoot({ 'normal.ts': '' });

    await expect(readLibrary(createStructurePaths(root))).rejects.toThrow();

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
