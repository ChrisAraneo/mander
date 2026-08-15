import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { TILE_DIAMOND } from './diamond';
import { findDiamondTiles } from './find-diamond-tiles';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findDiamondTiles', () => {
  it('should gather every diamond when the level is strewn with them', () => {
    expect(
      findDiamondTiles(
        level([
          [TILE_DIAMOND, TILE_AIR, TILE_DIAMOND],
          [TILE_AIR, TILE_DIAMOND, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should gather the one diamond when the level holds a single one', () => {
    expect(
      findDiamondTiles(
        level([
          [TILE_AIR, TILE_DIAMOND],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should gather nothing when the level holds no diamond', () => {
    expect(
      findDiamondTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
