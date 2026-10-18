import {
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createGroundPatches } from './create-ground-patches';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  s: TILE_STONE,
  '^': TILE_SPIKE,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('createGroundPatches', () => {
  it('should fill the bottom three rows with dirt when they are empty', () => {
    expect(createGroundPatches(createGrid(['..', '..', '..', '..']))).toEqual([
      { row: 1, column: 0, tile: TILE_DIRT },
      { row: 1, column: 1, tile: TILE_DIRT },
      { row: 2, column: 0, tile: TILE_DIRT },
      { row: 2, column: 1, tile: TILE_DIRT },
      { row: 3, column: 0, tile: TILE_DIRT },
      { row: 3, column: 1, tile: TILE_DIRT },
    ]);
  });

  it('should leave a solid tile alone when it lays the ground', () => {
    expect(createGroundPatches(createGrid(['.', '.', 's']))).toEqual([
      { row: 0, column: 0, tile: TILE_DIRT },
      { row: 1, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should lay dirt over a tile when it is not solid', () => {
    expect(createGroundPatches(createGrid(['.', '.', '^']))).toEqual([
      { row: 0, column: 0, tile: TILE_DIRT },
      { row: 1, column: 0, tile: TILE_DIRT },
      { row: 2, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should cover the whole grid when it is shorter than the ground', () => {
    expect(createGroundPatches(createGrid(['..']))).toEqual([
      { row: 0, column: 0, tile: TILE_DIRT },
      { row: 0, column: 1, tile: TILE_DIRT },
    ]);
  });

  it('should make no marks when the grid is empty', () => {
    expect(createGroundPatches([])).toEqual([]);
  });
});
