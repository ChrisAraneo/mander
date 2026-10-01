import {
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchTiles } from './patch-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchTiles', () => {
  it('should put the marked tiles into the grid when it gets marks', () => {
    expect(
      patchTiles(createLevel(), [
        { row: 0, column: 1, tile: TILE_GEM },
        { row: 1, column: 0, tile: TILE_STONE },
      ]),
    ).toEqual([
      [TILE_AIR, TILE_GEM],
      [TILE_STONE, TILE_DIRT],
    ]);
  });

  it('should keep the last mark when two marks fall on the same spot', () => {
    expect(
      patchTiles(createLevel(), [
        { row: 0, column: 0, tile: TILE_GEM },
        { row: 0, column: 0, tile: TILE_STONE },
      ])[0],
    ).toEqual([TILE_STONE, TILE_AIR]);
  });

  it('should leave a mark out when it falls off the grid', () => {
    expect(
      patchTiles(createLevel(), [
        { row: 2, column: 0, tile: TILE_GEM },
        { row: 0, column: 2, tile: TILE_GEM },
      ]),
    ).toEqual(createLevel());
  });

  it('should give back a copy of the grid when it gets no marks', () => {
    const tiles = createLevel();

    const patched = patchTiles(tiles, []);

    expect(patched).toEqual(tiles);
    expect(patched).not.toBe(tiles);
    expect(patched[0]).not.toBe(tiles[0]);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(patchTiles([], [{ row: 0, column: 0, tile: TILE_GEM }])).toEqual([]);
  });

  it('should not change the old grid when it puts marks in', () => {
    const tiles = createLevel();

    patchTiles(tiles, [{ row: 0, column: 0, tile: TILE_GEM }]);

    expect(tiles).toEqual(createLevel());
  });
});
