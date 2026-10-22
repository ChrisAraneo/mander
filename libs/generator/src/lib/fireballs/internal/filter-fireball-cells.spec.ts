import { TILE_AIR, TILE_DIRT, TILE_FIREBALL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterFireballCells } from './filter-fireball-cells';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_FIREBALL],
  [TILE_FIREBALL, TILE_DIRT],
];

describe('filterFireballCells', () => {
  it('should give the spot of every fireball when the grid holds some', () => {
    expect(filterFireballCells({ tiles: LEVEL, rate: 1 }).cells).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
    ]);
  });

  it('should give no spots when the grid holds no fireball', () => {
    expect(
      filterFireballCells({ tiles: [[TILE_DIRT]], rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterFireballCells({ tiles: [], rate: 1 }).cells).toEqual([]);
  });

  it('should pass the rate on when it looks for fireballs', () => {
    expect(filterFireballCells({ tiles: LEVEL, rate: 0 }).rate).toBe(0);
  });

  it('should keep the grid the same when it looks for fireballs', () => {
    expect(filterFireballCells({ tiles: LEVEL, rate: 1 }).tiles).toBe(LEVEL);
  });
});
