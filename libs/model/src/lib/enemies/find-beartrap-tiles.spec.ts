import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findBeartrapTiles } from './find-beartrap-tiles';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY } from './tile-enemy';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findBeartrapTiles', () => {
  it('should return every beartrap position when the level has several beartraps', () => {
    expect(
      findBeartrapTiles(
        createLevel([
          [TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ]);
  });

  it('should skip other enemies when the level mixes beartraps and enemies', () => {
    expect(
      findBeartrapTiles(
        createLevel([
          [TILE_ENEMY, TILE_BEARTRAP],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no beartrap', () => {
    expect(
      findBeartrapTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
