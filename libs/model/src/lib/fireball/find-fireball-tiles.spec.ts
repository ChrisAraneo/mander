import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import { TILE_FIREBALL } from '../blocks/fireball';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findFireballTiles } from './find-fireball-tiles';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findFireballTiles', () => {
  it('should gather every spot when the level plants several fireball blocks', () => {
    expect(
      findFireballTiles(
        level([
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

  it('should gather nothing when the level plants none', () => {
    expect(
      findFireballTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
