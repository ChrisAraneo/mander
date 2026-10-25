import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../../air/tile-air';
import type { Level } from '../../types/level';
import { isBesideLevel } from './is-beside-level';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 1,
  tiles: [[TILE_AIR, TILE_AIR]],
  chestItems: [],
};

describe('isBesideLevel', () => {
  it('should be true when the column is left of the level', () => {
    expect(isBesideLevel(LEVEL, -1)).toBe(true);
  });

  it('should be true when the column is right of the level', () => {
    expect(isBesideLevel(LEVEL, 2)).toBe(true);
  });

  it('should be false when the column is the first one of the level', () => {
    expect(isBesideLevel(LEVEL, 0)).toBe(false);
  });

  it('should be false when the column is the last one of the level', () => {
    expect(isBesideLevel(LEVEL, 1)).toBe(false);
  });

  it('should be true when the level has no columns', () => {
    expect(isBesideLevel({ ...LEVEL, width: 0, tiles: [] }, 0)).toBe(true);
  });
});
