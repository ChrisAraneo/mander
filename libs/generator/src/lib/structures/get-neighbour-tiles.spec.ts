import { TILE_AIR, TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getNeighbourTiles } from './get-neighbour-tiles';

const LEVEL: Tile[][] = [
  [TILE_STONE, TILE_STONE, TILE_STONE],
  [TILE_DIRT, TILE_AIR, TILE_DIRT],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('getNeighbourTiles', () => {
  it('should give all eight tiles around the spot when it sits inside the grid', () => {
    expect(getNeighbourTiles(LEVEL, 1, 1)).toEqual([
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
    expect(getNeighbourTiles(LEVEL, 0, 0)).toEqual([
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
    expect(getNeighbourTiles([], 0, 0)).toEqual([
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
