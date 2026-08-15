import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_CANNON } from '../blocks/cannon';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findCannonTiles } from './find-cannon-tiles';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findCannonTiles', () => {
  it('should gather every spot when the level mounts several cannons', () => {
    expect(
      findCannonTiles(
        level([
          [TILE_CANNON, TILE_AIR, TILE_CANNON],
          [TILE_AIR, TILE_CANNON, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should gather the one spot when the level mounts a single cannon', () => {
    expect(
      findCannonTiles(
        level([
          [TILE_AIR, TILE_CANNON],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should gather nothing when the level mounts no cannon', () => {
    expect(
      findCannonTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
