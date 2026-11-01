import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_FIREBALL } from '../blocks/tile-fireball';
import { TILE_PINKBALL } from '../blocks/tile-pinkball';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findPinkballTiles } from './find-pinkball-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findPinkballTiles', () => {
  it('should return every pink ball block position when the level has several', () => {
    expect(
      findPinkballTiles(
        createLevel([
          [TILE_PINKBALL, TILE_AIR, TILE_PINKBALL],
          [TILE_AIR, TILE_PINKBALL, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should leave the fireball blocks out when the level holds both kinds', () => {
    expect(
      findPinkballTiles(
        createLevel([
          [TILE_FIREBALL, TILE_PINKBALL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no pink ball block', () => {
    expect(
      findPinkballTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
