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

import { patchFrozenBlocks } from './patch-frozen-blocks';

const createTiles = (): Tile[][] => [
  [TILE_AIR, TILE_SPIKE, TILE_CANNON],
  [TILE_BRICK, TILE_STONE, TILE_WOOD],
  [TILE_DIRT, TILE_DIRT, TILE_ICE],
];

describe('patchFrozenBlocks', () => {
  it('should freeze every block but the dirt when it is given a grid', () => {
    expect(patchFrozenBlocks(createTiles())).toEqual([
      [TILE_AIR, TILE_SPIKE, TILE_CANNON],
      [TILE_ICE, TILE_ICE, TILE_ICE],
      [TILE_DIRT, TILE_DIRT, TILE_ICE],
    ]);
  });

  it('should leave the grid it was given untouched when it freezes the blocks', () => {
    const tiles = createTiles();

    patchFrozenBlocks(tiles);

    expect(tiles).toEqual(createTiles());
  });

  it('should hand back an empty grid when it is given one', () => {
    expect(patchFrozenBlocks([])).toEqual([]);
  });
});
