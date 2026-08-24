import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { TILE_GEM } from './gem';
import { findGemTiles } from './find-gem-tiles';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findGemTiles', () => {
  it('should gather every gem when the level is strewn with them', () => {
    expect(
      findGemTiles(
        level([
          [TILE_GEM, TILE_AIR, TILE_GEM],
          [TILE_AIR, TILE_GEM, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should gather the one gem when the level holds a single one', () => {
    expect(
      findGemTiles(
        level([
          [TILE_AIR, TILE_GEM],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should gather nothing when the level holds no gem', () => {
    expect(
      findGemTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
