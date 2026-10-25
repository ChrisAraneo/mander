import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findGemTiles } from './find-gem-tiles';
import { TILE_GEM } from './tile-gem';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findGemTiles', () => {
  it('should return every gem position when the level has several gems', () => {
    expect(
      findGemTiles(
        createLevel([
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

  it('should return one position when the level has a single gem', () => {
    expect(
      findGemTiles(
        createLevel([
          [TILE_AIR, TILE_GEM],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no gem', () => {
    expect(
      findGemTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
