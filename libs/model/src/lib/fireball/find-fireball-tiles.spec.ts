import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_FIREBALL } from '../blocks/tile-fireball';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findFireballTiles } from './find-fireball-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findFireballTiles', () => {
  it('should return every fireball block position when the level has several', () => {
    expect(
      findFireballTiles(
        createLevel([
          [TILE_FIREBALL, TILE_AIR, TILE_FIREBALL],
          [TILE_AIR, TILE_FIREBALL, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should return nothing when the level has no fireball block', () => {
    expect(
      findFireballTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
