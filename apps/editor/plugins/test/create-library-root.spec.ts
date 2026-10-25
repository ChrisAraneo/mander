import { endsWith } from 'lodash-es';
import { readFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createLibraryRoot } from './create-library-root.ts';

describe('createLibraryRoot', () => {
  it('should lay the files out in the structure library beside the editor when it is given some', async () => {
    const root = await createLibraryRoot({ 'normal.ts': 'normal\r\n' });

    const written = await readFile(
      resolve(root, '../../libs/structures/src/lib/normal.ts'),
      'utf8',
    );

    expect(written).toBe('normal\r\n');
    expect(endsWith(root, join('apps', 'editor'))).toBe(true);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });
});
