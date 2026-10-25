import { describe, expect, it } from 'vitest';

import type { Level } from '../types/level';
import { getWorldMeta } from './get-world-meta';
import type { World } from './types/world';

const createLevel = (seed: string): Level => ({
  seed,
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
});

const createLevelWithMeta = (seed: string, structures: string[]): Level => ({
  ...createLevel(seed),
  meta: { structures },
});

const createWorld = (levels: Level[]): World => ({
  name: 'TEST',
  levels,
  score: 0,
});

describe('getWorldMeta', () => {
  it('should list the structures of each level when the levels have meta', () => {
    expect(
      getWorldMeta(
        createWorld([
          createLevelWithMeta('a', ['NORMAL_001', 'NORMAL_002']),
          createLevelWithMeta('b', ['VERTICAL_003']),
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

  it('should list no structures when the level has no meta', () => {
    expect(getWorldMeta(createWorld([createLevel('a')])).levels).toEqual([
      { level: 1, structures: [] },
    ]);
  });

  it('should list no levels when the world has no levels', () => {
    expect(getWorldMeta(createWorld([]))).toEqual({ name: 'TEST', levels: [] });
  });
});
