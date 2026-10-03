import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPaintPatches } from './create-paint-patches';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  B: TILE_BRICK,
  S: STRUCTURE_START,
  E: STRUCTURE_END,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('createPaintPatches', () => {
  it('should mark every drawn tile at its place in the grid when it paints a layer', () => {
    expect(
      createPaintPatches([
        { layer: createGrid(['#.', '.B']), row: 2, column: 3 },
      ]),
    ).toEqual([
      { row: 2, column: 3, tile: TILE_DIRT },
      { row: 3, column: 4, tile: TILE_BRICK },
    ]);
  });

  it('should leave the start and the end markers out when it paints a layer', () => {
    expect(
      createPaintPatches([{ layer: createGrid(['S#E']), row: 0, column: 0 }]),
    ).toEqual([{ row: 0, column: 1, tile: TILE_DIRT }]);
  });

  it('should paint the layers in their order when two of them cover the same spot', () => {
    expect(
      createPaintPatches([
        { layer: createGrid(['#']), row: 1, column: 1 },
        { layer: createGrid(['B']), row: 1, column: 1 },
      ]),
    ).toEqual([
      { row: 1, column: 1, tile: TILE_DIRT },
      { row: 1, column: 1, tile: TILE_BRICK },
    ]);
  });

  it('should make no marks when the layers hold nothing drawn', () => {
    expect(
      createPaintPatches([{ layer: createGrid(['..']), row: 0, column: 0 }]),
    ).toEqual([]);
  });

  it('should make no marks when there are no layers', () => {
    expect(createPaintPatches([])).toEqual([]);
  });
});
