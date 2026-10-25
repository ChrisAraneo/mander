import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createLibraryRoot } from '../test/create-library-root.ts';
import { writeLibraryFile } from './write-library-file.ts';

const LIBRARY =
  "import { HARD_001 } from './hard';\r\n\r\nexport const HARD_LIBRARY = Object.freeze({\r\n  HARD_001,\r\n});\r\n";

const createPath = (root: string): string =>
  resolve(root, '../../libs/structures/src/lib/library.ts');

describe('writeLibraryFile', () => {
  it('should import the structure and deal it into its pool in the line endings of the file when it is new', async () => {
    const root = await createLibraryRoot({ 'library.ts': LIBRARY });

    await writeLibraryFile(createPath(root), 'HARD_002', 'hard');

    expect(await readFile(createPath(root), 'utf8')).toBe(
      "import { HARD_001, HARD_002 } from './hard';\r\n\r\nexport const HARD_LIBRARY = Object.freeze({\r\n  HARD_001,\r\n  HARD_002,\r\n});\r\n",
    );

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should leave the library as it was when it already has the structure', async () => {
    const root = await createLibraryRoot({ 'library.ts': LIBRARY });

    await writeLibraryFile(createPath(root), 'HARD_001', 'hard');

    expect(await readFile(createPath(root), 'utf8')).toBe(LIBRARY);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should leave the library empty when it is empty', async () => {
    const root = await createLibraryRoot({ 'library.ts': '' });

    await writeLibraryFile(createPath(root), 'HARD_001', 'hard');

    expect(await readFile(createPath(root), 'utf8')).toBe('');

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
