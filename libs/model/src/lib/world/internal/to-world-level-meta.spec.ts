import { describe, expect, it } from 'vitest';

import type { Level } from '../../types/level';
import { toWorldLevelMeta } from './to-world-level-meta';

const LEVEL: Level = {
  seed: 'SEED',
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
};

describe('toWorldLevelMeta', () => {
  it('should number the level from one and list its structures when the level has meta', () => {
    const structures = ['NORMAL_001', 'VERTICAL_003'];

    const meta = toWorldLevelMeta({ ...LEVEL, meta: { structures } }, 2);

    expect(meta).toEqual({ level: 3, structures });
    expect(meta.structures).toBe(structures);
  });

  it('should give the first level the number one when the index is zero', () => {
    const meta = toWorldLevelMeta(LEVEL, 0);

    expect(meta.level).toBe(1);
  });

  it('should list no structures when the level has no meta', () => {
    const meta = toWorldLevelMeta(LEVEL, 0);

    expect(meta.structures).toEqual([]);
  });
});
