import { TILE_CANNON, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getCannonRemovalRate } from './get-cannon-removal-rate';

const LEVEL: Tile[][] = [[TILE_CANNON]];

const getRate = (levelNumber: number) =>
  getCannonRemovalRate({ tiles: LEVEL, levelNumber }).rate;

describe('getCannonRemovalRate', () => {
  it('should fill every cannon in when the level is before the fifth', () => {
    expect(getRate(1)).toBe(1);
    expect(getRate(4)).toBe(1);
  });

  it('should leave the cannons standing when the level is the fifth or later', () => {
    expect(getRate(5)).toBe(0);
    expect(getRate(8)).toBe(0);
  });

  it('should hold a rate for every level of the day when it is given each one', () => {
    expect(map(range(1, LEVELS_PER_DAY + 1), getRate)).toEqual([
      1, 1, 1, 1, 0, 0, 0, 0,
    ]);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(getCannonRemovalRate({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });
});
