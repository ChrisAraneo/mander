import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from './create-structure-paths.ts';

describe('createStructurePaths', () => {
  it('should point at the structure library two folders above the editor when it is given the editor root', () => {
    const root = resolve('/repo/apps/editor');

    expect(createStructurePaths(root)).toEqual({
      structures: {
        normal: resolve('/repo/libs/structures/src/lib/normal.ts'),
        hard: resolve('/repo/libs/structures/src/lib/hard.ts'),
        vertical: resolve('/repo/libs/structures/src/lib/vertical.ts'),
      },
      library: resolve('/repo/libs/structures/src/lib/library.ts'),
    });
  });
});
