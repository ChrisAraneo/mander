import { TILE_FIREBALL, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getFireballRemovalRate } from './get-fireball-removal-rate';

const LEVEL: Tile[][] = [[TILE_FIREBALL]];

const getRate = (levelNumber: number) =>
  getFireballRemovalRate({ tiles: LEVEL, levelNumber }).rate;

describe('getFireballRemovalRate', () => {
  it('should put every fireball out when the level is before the fourth', () => {
    expect(getRate(1)).toBe(1);
    expect(getRate(3)).toBe(1);
  });

  it('should leave the fireballs burning when the level is the fourth or later', () => {
    expect(getRate(4)).toBe(0);
    expect(getRate(8)).toBe(0);
  });

  it('should hold a rate for every level of the day when it is given each one', () => {
    expect(map(range(1, LEVELS_PER_DAY + 1), getRate)).toEqual([
      1, 1, 1, 0, 0, 0, 0, 0,
    ]);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(getFireballRemovalRate({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });
});
