import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ICE,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { freezeBlocks } from './freeze-blocks';

const TILES: Tile[][] = [
  [TILE_AIR, TILE_SPIKE, TILE_CANNON],
  [TILE_BRICK, TILE_STONE, TILE_WOOD],
  [TILE_DIRT, TILE_DIRT, TILE_ICE],
];

describe('freezeBlocks', () => {
  it('should freeze every block but the dirt when it is given a grid', () => {
    expect(freezeBlocks(TILES)).toEqual([
      [TILE_AIR, TILE_SPIKE, TILE_CANNON],
      [TILE_ICE, TILE_ICE, TILE_ICE],
      [TILE_DIRT, TILE_DIRT, TILE_ICE],
    ]);
  });

  it('should leave the grid it was given untouched when it freezes the blocks', () => {
    freezeBlocks(TILES);

    expect(TILES[1]).toEqual([TILE_BRICK, TILE_STONE, TILE_WOOD]);
  });

  it('should hand back an empty grid when it is given one', () => {
    expect(freezeBlocks([])).toEqual([]);
  });
});
