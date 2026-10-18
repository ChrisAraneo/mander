import { TILE_AIR, TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchStoneTiles } from './patch-stone-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchStoneTiles', () => {
  it('should put the stone tiles in the grid when it gets marks', () => {
    expect(
      patchStoneTiles({
        tiles: createLevel(),
        patches: [
          { row: 1, column: 0, tile: TILE_STONE },
          { row: 2, column: 1, tile: TILE_STONE },
        ],
      }),
    ).toEqual([
      [TILE_AIR, TILE_AIR],
      [TILE_STONE, TILE_DIRT],
      [TILE_DIRT, TILE_STONE],
    ]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchStoneTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it adds a stone', () => {
    const tiles = createLevel();

    patchStoneTiles({
      tiles,
      patches: [{ row: 2, column: 0, tile: TILE_STONE }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
