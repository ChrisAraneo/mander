import { TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterTileCells } from './filter-tile-cells';

describe('filterTileCells', () => {
  it('should give the spot of every matching tile row by row when the grid holds them', () => {
    expect(
      filterTileCells(
        [
          [TILE_AIR, TILE_CANNON, TILE_AIR],
          [TILE_CANNON, TILE_DIRT, TILE_CANNON],
        ],
        TILE_CANNON,
      ),
    ).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 2 },
    ]);
  });

  it('should give no spots when no tile matches', () => {
    expect(filterTileCells([[TILE_AIR, TILE_DIRT]], TILE_CANNON)).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterTileCells([], TILE_CANNON)).toEqual([]);
  });
});
