import {
  type Level,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_ICE,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  ICE_TILE_LIGHT_DENSITY,
  LIGHT_RECEIVER_WALL,
  SOLID_TILE_LIGHT_DENSITY,
} from '../consts';
import { createTileLightBytes } from './create-tile-light-bytes';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_AIR, TILE_DIRT],
    [TILE_ICE, TILE_AIR],
  ],
  backTiles: [
    [TILE_AIR, TILE_AIR],
    [TILE_AIR, TILE_BRICK],
  ],
  chestItems: [],
};

describe('createTileLightBytes', () => {
  it('should give each tile its density and whether it catches shadow, row by row', () => {
    expect([...createTileLightBytes(LEVEL)]).toEqual([
      0,
      0,
      SOLID_TILE_LIGHT_DENSITY,
      LIGHT_RECEIVER_WALL,
      ICE_TILE_LIGHT_DENSITY,
      LIGHT_RECEIVER_WALL,
      0,
      LIGHT_RECEIVER_WALL,
    ]);
  });

  it('should leave open air empty when the level has no back tiles', () => {
    expect([
      ...createTileLightBytes({ ...LEVEL, backTiles: undefined }),
    ]).toEqual([
      0,
      0,
      SOLID_TILE_LIGHT_DENSITY,
      LIGHT_RECEIVER_WALL,
      ICE_TILE_LIGHT_DENSITY,
      LIGHT_RECEIVER_WALL,
      0,
      0,
    ]);
  });
});
