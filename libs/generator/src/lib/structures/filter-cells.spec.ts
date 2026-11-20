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

const createGrid = (): Tile[][] => [
  [TILE_DIRT, TILE_AIR, TILE_STONE],
  [TILE_SPIKE, TILE_DIRT, TILE_AIR],
];

describe('filterCells', () => {
  it('should give a spot for every block the test accepts when the level holds them', () => {
    expect(filterCells(createGrid(), isSolidTile)).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the test accepts no block of the level', () => {
    expect(filterCells([[TILE_AIR, TILE_AIR]], isSolidTile)).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterCells([], isSolidTile)).toEqual([]);
  });

  it('should keep the grid the same when it looks through it', () => {
    const tiles = createGrid();

    filterCells(tiles, isSolidTile);

    expect(tiles).toEqual(createGrid());
  });
});
