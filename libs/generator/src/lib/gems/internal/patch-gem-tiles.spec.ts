import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchGemTiles } from './patch-gem-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchGemTiles', () => {
  it('should put the gem tiles in the grid when it gets marks', () => {
    expect(
      patchGemTiles({
        tiles: createLevel(),
        patches: [
          { row: 0, column: 0, tile: TILE_GEM },
          { row: 1, column: 1, tile: TILE_GEM },
        ],
      }),
    ).toEqual([
      [TILE_GEM, TILE_AIR],
      [TILE_AIR, TILE_GEM],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should leave the other tiles alone when it adds a gem', () => {
    expect(
      patchGemTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_GEM }],
      })[2],
    ).toEqual([TILE_DIRT, TILE_DIRT]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchGemTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it adds a gem', () => {
    const tiles = createLevel();

    patchGemTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_GEM }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
