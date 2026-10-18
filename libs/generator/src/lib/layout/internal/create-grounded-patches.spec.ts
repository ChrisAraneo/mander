import {
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createGroundedPatches } from './create-grounded-patches';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  s: TILE_STONE,
  '^': TILE_SPIKE,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const LEVEL = createGrid(['.', '.', '.', '.', '.']);

describe('createGroundedPatches', () => {
  it('should paint the layers and lay the ground under them when it grounds a stack', () => {
    expect(
      createGroundedPatches(LEVEL, [
        { layer: createGrid(['#']), row: 0, column: 0 },
      ]),
    ).toEqual([
      { row: 0, column: 0, tile: TILE_DIRT },
      { row: 2, column: 0, tile: TILE_DIRT },
      { row: 3, column: 0, tile: TILE_DIRT },
      { row: 4, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should lay the ground after a painted tile when that tile is not solid', () => {
    expect(
      createGroundedPatches(LEVEL, [
        { layer: createGrid(['^']), row: 4, column: 0 },
      ]),
    ).toEqual([
      { row: 4, column: 0, tile: TILE_SPIKE },
      { row: 2, column: 0, tile: TILE_DIRT },
      { row: 3, column: 0, tile: TILE_DIRT },
      { row: 4, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should leave the ground off a painted tile when that tile is solid', () => {
    expect(
      createGroundedPatches(LEVEL, [
        { layer: createGrid(['s']), row: 4, column: 0 },
      ]),
    ).toEqual([
      { row: 4, column: 0, tile: TILE_STONE },
      { row: 2, column: 0, tile: TILE_DIRT },
      { row: 3, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should make no marks when the grid is empty and there are no layers', () => {
    expect(createGroundedPatches([], [])).toEqual([]);
  });
});
