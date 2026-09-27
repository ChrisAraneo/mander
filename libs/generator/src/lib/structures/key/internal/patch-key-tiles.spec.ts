import { TILE_AIR, TILE_DIRT, TILE_KEY, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchKeyTiles } from './patch-key-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchKeyTiles', () => {
  it('should put the key tile in the grid when it gets a mark', () => {
    expect(
      patchKeyTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_KEY }],
      }),
    ).toEqual([
      [TILE_AIR, TILE_KEY],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should leave the other tiles alone when it adds a key', () => {
    expect(
      patchKeyTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_KEY }],
      })[1],
    ).toEqual([TILE_DIRT, TILE_DIRT]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchKeyTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it adds a key', () => {
    const tiles = createLevel();

    patchKeyTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_KEY }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
