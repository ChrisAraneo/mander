import { TILE_BEARTRAP, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getBeartrapRemovalRate } from './get-beartrap-removal-rate';

const LEVEL: Tile[][] = [[TILE_BEARTRAP]];

const rateOn = (levelNumber: number) =>
  getBeartrapRemovalRate({ tiles: LEVEL, levelNumber }).rate;

describe('getBeartrapRemovalRate', () => {
  it('should remove half the traps when the level is the first', () => {
    expect(rateOn(1)).toBe(0.5);
  });

  it('should remove fewer traps when the level is the second or the third', () => {
    expect(rateOn(2)).toBe(0.35);
    expect(rateOn(3)).toBe(0.2);
  });

  it('should remove no traps when the level is the fourth or later', () => {
    expect(rateOn(4)).toBe(0);
    expect(rateOn(8)).toBe(0);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(getBeartrapRemovalRate({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });

  it('should pass the level number on when it reads it', () => {
    expect(
      getBeartrapRemovalRate({ tiles: LEVEL, levelNumber: 3 }).levelNumber,
    ).toBe(3);
  });
});
