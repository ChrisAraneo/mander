import { TILE_AIR, TILE_DIRT, TILE_SPAWN, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchPlayerSpawnTiles } from './patch-player-spawn-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchPlayerSpawnTiles', () => {
  it('should put the spawn tiles in the grid when it gets marks', () => {
    expect(
      patchPlayerSpawnTiles({
        tiles: createLevel(),
        patches: [
          { row: 1, column: 0, tile: TILE_SPAWN },
          { row: 0, column: 0, tile: TILE_SPAWN },
        ],
      }),
    ).toEqual([
      [TILE_SPAWN, TILE_AIR],
      [TILE_SPAWN, TILE_AIR],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should leave the other tiles alone when it adds a spawn', () => {
    expect(
      patchPlayerSpawnTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_SPAWN }],
      })[2],
    ).toEqual([TILE_DIRT, TILE_DIRT]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(
      patchPlayerSpawnTiles({ tiles: createLevel(), patches: [] }),
    ).toEqual(createLevel());
  });

  it('should not change the old grid when it adds a spawn', () => {
    const tiles = createLevel();

    patchPlayerSpawnTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_SPAWN }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
