import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_CANNON } from '../blocks/tile-cannon';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findCannonTiles } from './find-cannon-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findCannonTiles', () => {
  it('should return every cannon position when the level has several cannons', () => {
    expect(
      findCannonTiles(
        createLevel([
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

  it('should return one position when the level has a single cannon', () => {
    expect(
      findCannonTiles(
        createLevel([
          [TILE_AIR, TILE_CANNON],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no cannon', () => {
    expect(
      findCannonTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
