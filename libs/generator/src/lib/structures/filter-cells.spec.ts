import {
  isSolidTile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterCells } from './filter-cells';

const GRID: Tile[][] = [
  [TILE_DIRT, TILE_AIR, TILE_STONE],
  [TILE_SPIKE, TILE_DIRT, TILE_AIR],
];

describe('filterCells', () => {
  it('should give the spot of every cell the test accepts when the grid holds them', () => {
    expect(filterCells(GRID, isSolidTile)).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the test accepts no cell of the grid', () => {
    expect(filterCells([[TILE_AIR, TILE_AIR]], isSolidTile)).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterCells([], isSolidTile)).toEqual([]);
  });

  it('should keep the grid the same when it looks through it', () => {
    filterCells(GRID, isSolidTile);

    expect(GRID).toEqual([
      [TILE_DIRT, TILE_AIR, TILE_STONE],
      [TILE_SPIKE, TILE_DIRT, TILE_AIR],
    ]);
  });
});
