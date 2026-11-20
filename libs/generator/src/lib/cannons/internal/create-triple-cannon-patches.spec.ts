import { type Tile, TILE_CANNON_TRIPLE, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Cell } from '../../types/cell';
import { createTripleCannonPatches } from './create-triple-cannon-patches';

const TILES: Tile[][] = [[TILE_DIRT]];

const CELLS: Cell[] = [
  { row: 0, column: 1 },
  { row: 2, column: 3 },
];

describe('createTripleCannonPatches', () => {
  it('should put a triple cannon on every spot when it is given some spots', () => {
    expect(
      createTripleCannonPatches({ tiles: TILES, cells: CELLS }).patches,
    ).toEqual([
      { row: 0, column: 1, tile: TILE_CANNON_TRIPLE },
      { row: 2, column: 3, tile: TILE_CANNON_TRIPLE },
    ]);
  });

  it('should give no edits when it is given no spots', () => {
    expect(
      createTripleCannonPatches({ tiles: TILES, cells: [] }).patches,
    ).toEqual([]);
  });

  it('should pass the level on when it collects the edits', () => {
    expect(
      createTripleCannonPatches({ tiles: TILES, cells: CELLS }).tiles,
    ).toBe(TILES);
  });
});
