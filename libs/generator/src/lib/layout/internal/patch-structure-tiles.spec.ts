import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchStructureTiles } from './patch-structure-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR],
];

describe('patchStructureTiles', () => {
  it('should put the front marks into the front layer when it applies the marks', () => {
    expect(
      patchStructureTiles({
        tiles: createLevel(),
        frontPatches: [{ row: 1, column: 0, tile: TILE_DIRT }],
        backPatches: [{ row: 0, column: 1, tile: TILE_BRICK }],
      }).tiles,
    ).toEqual([
      [TILE_AIR, TILE_AIR],
      [TILE_DIRT, TILE_AIR],
    ]);
  });

  it('should put the back marks into the back layer when it applies the marks', () => {
    expect(
      patchStructureTiles({
        tiles: createLevel(),
        frontPatches: [{ row: 1, column: 0, tile: TILE_DIRT }],
        backPatches: [{ row: 0, column: 1, tile: TILE_BRICK }],
      }).backTiles,
    ).toEqual([
      [TILE_AIR, TILE_BRICK],
      [TILE_AIR, TILE_AIR],
    ]);
  });

  it('should give back two empty layers when the grid is empty', () => {
    expect(
      patchStructureTiles({ tiles: [], frontPatches: [], backPatches: [] }),
    ).toEqual({ tiles: [], backTiles: [] });
  });

  it('should not change the old grid when it applies the marks', () => {
    const tiles = createLevel();

    patchStructureTiles({
      tiles,
      frontPatches: [{ row: 0, column: 0, tile: TILE_DIRT }],
      backPatches: [{ row: 1, column: 1, tile: TILE_BRICK }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
