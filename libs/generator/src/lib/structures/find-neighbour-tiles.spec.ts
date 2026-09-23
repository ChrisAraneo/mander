import { TILE_AIR, TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findNeighbourTiles } from './find-neighbour-tiles';

const LEVEL: Tile[][] = [
  [TILE_STONE, TILE_STONE, TILE_STONE],
  [TILE_DIRT, TILE_AIR, TILE_DIRT],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('findNeighbourTiles', () => {
  it('should give all eight tiles around the spot when it sits inside the grid', () => {
    expect(findNeighbourTiles(LEVEL, 1, 1)).toEqual([
      TILE_STONE,
      TILE_AIR,
      TILE_DIRT,
      TILE_DIRT,
      TILE_STONE,
      TILE_STONE,
      TILE_AIR,
      TILE_AIR,
    ]);
  });

  it('should leave a gap when the neighbour falls off the grid', () => {
    expect(findNeighbourTiles(LEVEL, 0, 0)).toEqual([
      undefined,
      TILE_DIRT,
      undefined,
      TILE_STONE,
      undefined,
      undefined,
      undefined,
      TILE_AIR,
    ]);
  });

  it('should leave every neighbour a gap when the grid is empty', () => {
    expect(findNeighbourTiles([], 0, 0)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });
});
