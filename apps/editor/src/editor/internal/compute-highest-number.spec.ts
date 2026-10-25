import { describe, expect, it } from 'vitest';

import type { Pool } from '../types/pool';
import type { StructureEntry } from '../types/structure-entry';
import { computeHighestNumber } from './compute-highest-number';

const createEntry = (name: string, pool: Pool): StructureEntry => ({
  name,
  pool,
  sketch: { tiles: [], backTiles: [] },
});

describe('computeHighestNumber', () => {
  it('should give the highest number in the pool when the pool has structures', () => {
    expect(
      computeHighestNumber(
        [
          createEntry('HARD_007', 'hard'),
          createEntry('HARD_003', 'hard'),
          createEntry('NORMAL_040', 'normal'),
        ],
        'hard',
      ),
    ).toBe(7);
  });

  it('should give zero when the pool has no structures', () => {
    expect(computeHighestNumber([], 'normal')).toBe(0);
  });
});
