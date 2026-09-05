import { describe, expect, it } from 'vitest';

import type { Level } from '../level/level';
import { getWorldMeta } from './get-world-meta';
import type { World } from './world';

const levelOf = (seed: string, structures?: string[]): Level => ({
  seed,
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
  ...(structures ? { meta: { structures } } : {}),
});

const worldOf = (levels: Level[]): World => ({
  name: 'TEST',
  levels,
  score: 0,
});

describe('getWorldMeta', () => {
  it('should report the structures every level was built from', () => {
    expect(
      getWorldMeta(
        worldOf([
          levelOf('a', ['NORMAL_001', 'NORMAL_002']),
          levelOf('b', ['VERTICAL_003']),
        ]),
      ),
    ).toEqual({
      name: 'TEST',
      levels: [
        { level: 1, structures: ['NORMAL_001', 'NORMAL_002'] },
        { level: 2, structures: ['VERTICAL_003'] },
      ],
    });
  });

  it('should report no structures for a level without meta', () => {
    expect(getWorldMeta(worldOf([levelOf('a')])).levels).toEqual([
      { level: 1, structures: [] },
    ]);
  });
});
