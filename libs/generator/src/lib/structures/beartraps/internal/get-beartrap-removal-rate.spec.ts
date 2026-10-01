import { TILE_BEARTRAP, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { getBeartrapRemovalRate } from './get-beartrap-removal-rate';

const LEVEL: Tile[][] = [[TILE_BEARTRAP]];

const RANDOM = createRandom('SEED');

const getRate = (levelNumber: number) =>
  getBeartrapRemovalRate({ tiles: LEVEL, levelNumber, random: RANDOM }).rate;

describe('getBeartrapRemovalRate', () => {
  it('should remove half the traps when the level is the first', () => {
    expect(getRate(1)).toBe(0.5);
  });

  it('should remove fewer traps when the level is the second or the third', () => {
    expect(getRate(2)).toBe(0.35);
    expect(getRate(3)).toBe(0.2);
  });

  it('should remove no traps when the level is the fourth or later', () => {
    expect(getRate(4)).toBe(0);
    expect(getRate(8)).toBe(0);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(
      getBeartrapRemovalRate({
        tiles: LEVEL,
        levelNumber: 1,
        random: RANDOM,
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the generator on when it reads the level number', () => {
    expect(
      getBeartrapRemovalRate({ tiles: LEVEL, levelNumber: 1, random: RANDOM })
        .random,
    ).toBe(RANDOM);
  });
});
