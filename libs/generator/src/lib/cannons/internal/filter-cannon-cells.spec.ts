import { TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterCannonCells } from './filter-cannon-cells';

const LEVEL = [
  [TILE_AIR, TILE_CANNON],
  [TILE_CANNON, TILE_DIRT],
];

describe('filterCannonCells', () => {
  it('should give the spot of every cannon when the grid holds some', () => {
    expect(filterCannonCells({ tiles: LEVEL, rate: 1 }).cells).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
    ]);
  });

  it('should give no spots when the grid holds no cannon', () => {
    expect(filterCannonCells({ tiles: [[TILE_DIRT]], rate: 1 }).cells).toEqual(
      [],
    );
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterCannonCells({ tiles: [], rate: 1 }).cells).toEqual([]);
  });

  it('should pass the rate on when it looks for cannons', () => {
    expect(filterCannonCells({ tiles: LEVEL, rate: 0 }).rate).toBe(0);
  });

  it('should keep the grid the same when it looks for cannons', () => {
    expect(filterCannonCells({ tiles: LEVEL, rate: 1 }).tiles).toBe(LEVEL);
  });
});
