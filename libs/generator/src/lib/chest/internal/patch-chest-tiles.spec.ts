import { TILE_AIR, TILE_CHEST, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchChestTiles } from './patch-chest-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchChestTiles', () => {
  it('should put the chest tile in the grid when it gets a mark', () => {
    expect(
      patchChestTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_CHEST }],
      }),
    ).toEqual([
      [TILE_AIR, TILE_CHEST],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should leave the other tiles alone when it adds a chest', () => {
    expect(
      patchChestTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_CHEST }],
      })[1],
    ).toEqual([TILE_DIRT, TILE_DIRT]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchChestTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it adds a chest', () => {
    const tiles = createLevel();

    patchChestTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_CHEST }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
