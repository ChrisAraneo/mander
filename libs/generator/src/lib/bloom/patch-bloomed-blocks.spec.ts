import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_PINKBALL,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchBloomedBlocks } from './patch-bloomed-blocks';

const createTiles = (): Tile[][] => [
  [TILE_AIR, TILE_FIREBALL],
  [TILE_BRICK, TILE_DIRT],
];

describe('patchBloomedBlocks', () => {
  it('should swap every fireball for a pink ball when it blooms the grid', () => {
    expect(patchBloomedBlocks(createTiles())).toEqual([
      [TILE_AIR, TILE_PINKBALL],
      [TILE_BRICK, TILE_DIRT],
    ]);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(patchBloomedBlocks([])).toEqual([]);
  });

  it('should leave the old grid alone when it blooms one', () => {
    const tiles = createTiles();

    patchBloomedBlocks(tiles);

    expect(tiles).toEqual(createTiles());
  });
});
