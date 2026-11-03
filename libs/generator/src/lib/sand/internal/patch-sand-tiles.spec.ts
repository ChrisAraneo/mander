import {
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SAND,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchSandTiles } from './patch-sand-tiles';

const createTiles = (): Tile[][] => [
  [TILE_AIR, TILE_WOOD, TILE_WOOD],
  [TILE_STONE, TILE_DIRT, TILE_BRICK],
];

describe('patchSandTiles', () => {
  it('should turn every block of the given kind to sand when it is given a grid', () => {
    expect(patchSandTiles(createTiles(), TILE_WOOD)).toEqual([
      [TILE_AIR, TILE_SAND, TILE_SAND],
      [TILE_STONE, TILE_DIRT, TILE_BRICK],
    ]);
  });

  it('should leave the grid as it is when the grid has no block of the given kind', () => {
    expect(patchSandTiles([[TILE_AIR, TILE_DIRT]], TILE_WOOD)).toEqual([
      [TILE_AIR, TILE_DIRT],
    ]);
  });

  it('should leave the grid as it is when it is given no kind of block', () => {
    expect(patchSandTiles(createTiles(), undefined)).toEqual(createTiles());
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(patchSandTiles([], TILE_WOOD)).toEqual([]);
  });

  it('should not change the old grid when it turns blocks to sand', () => {
    const tiles = createTiles();

    patchSandTiles(tiles, TILE_WOOD);

    expect(tiles).toEqual(createTiles());
  });
});
