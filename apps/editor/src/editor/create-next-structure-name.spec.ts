import { describe, expect, it } from 'vitest';

import { createNextStructureName } from './create-next-structure-name';
import type { Pool } from './types/pool';
import type { StructureEntry } from './types/structure-entry';

const createEntry = (name: string, pool: Pool): StructureEntry => ({
  name,
  pool,
  sketch: { tiles: [], backTiles: [] },
});

describe('createNextStructureName', () => {
  it('should give the number after the highest one in the pool when the pool has structures', () => {
    expect(
      createNextStructureName(
        [
          createEntry('NORMAL_002', 'normal'),
          createEntry('NORMAL_009', 'normal'),
          createEntry('HARD_040', 'hard'),
        ],
        'normal',
      ),
    ).toBe('NORMAL_010');
  });

  it('should start at one when the pool has no structures', () => {
    expect(
      createNextStructureName(
        [createEntry('NORMAL_002', 'normal')],
        'vertical',
      ),
    ).toBe('VERTICAL_001');
  });

  it('should keep counting past three digits when the pool is that large', () => {
    expect(
      createNextStructureName([createEntry('HARD_999', 'hard')], 'hard'),
    ).toBe('HARD_1000');
  });
});
