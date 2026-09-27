import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchPortalTiles } from './patch-portal-tiles';

const level = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchPortalTiles', () => {
  it('should put the portal tiles in the grid when it gets marks', () => {
    expect(
      patchPortalTiles({
        tiles: level(),
        patches: [
          { row: 1, column: 1, tile: TILE_PORTAL },
          { row: 0, column: 1, tile: TILE_PORTAL },
        ],
      }),
    ).toEqual([
      [TILE_AIR, TILE_PORTAL],
      [TILE_AIR, TILE_PORTAL],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should leave the other tiles alone when it adds a portal', () => {
    expect(
      patchPortalTiles({
        tiles: level(),
        patches: [{ row: 0, column: 1, tile: TILE_PORTAL }],
      })[2],
    ).toEqual([TILE_DIRT, TILE_DIRT]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchPortalTiles({ tiles: level(), patches: [] })).toEqual(level());
  });

  it('should not change the old grid when it adds a portal', () => {
    const tiles = level();

    patchPortalTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_PORTAL }],
    });

    expect(tiles).toEqual(level());
  });
});
