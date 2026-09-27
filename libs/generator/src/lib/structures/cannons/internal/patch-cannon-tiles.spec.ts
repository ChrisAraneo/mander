import { TILE_AIR, TILE_BRICK, TILE_CANNON } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchCannonTiles } from './patch-cannon-tiles';

const level = () => [
  [TILE_AIR, TILE_CANNON],
  [TILE_CANNON, TILE_AIR],
];

describe('patchCannonTiles', () => {
  it('should brick over the cannons when it gets marks', () => {
    expect(
      patchCannonTiles({
        tiles: level(),
        patches: [
          { row: 0, column: 1, tile: TILE_BRICK },
          { row: 1, column: 0, tile: TILE_BRICK },
        ],
      }),
    ).toEqual([
      [TILE_AIR, TILE_BRICK],
      [TILE_BRICK, TILE_AIR],
    ]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchCannonTiles({ tiles: level(), patches: [] })).toEqual(level());
  });

  it('should not change the old grid when it bricks a cannon', () => {
    const tiles = level();

    patchCannonTiles({
      tiles,
      patches: [{ row: 0, column: 1, tile: TILE_BRICK }],
    });

    expect(tiles).toEqual(level());
  });
});
