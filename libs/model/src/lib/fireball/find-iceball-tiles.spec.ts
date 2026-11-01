import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_FIREBALL } from '../blocks/tile-fireball';
import { TILE_ICEBALL } from '../blocks/tile-iceball';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findIceballTiles } from './find-iceball-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findIceballTiles', () => {
  it('should return every ice ball block position when the level has several', () => {
    expect(
      findIceballTiles(
        createLevel([
          [TILE_ICEBALL, TILE_AIR, TILE_ICEBALL],
          [TILE_AIR, TILE_ICEBALL, TILE_AIR],
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
      findIceballTiles(
        createLevel([
          [TILE_FIREBALL, TILE_ICEBALL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no ice ball block', () => {
    expect(
      findIceballTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
