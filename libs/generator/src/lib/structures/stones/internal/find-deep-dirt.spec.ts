import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findDeepDirt } from './find-deep-dirt';

const cellsIn = (tiles: Tile[][], depth: number) =>
  findDeepDirt({ tiles, depth }).cells;

describe('findDeepDirt', () => {
  it('should mark the dirt that lies at the dirt depth or deeper', () => {
    expect(
      cellsIn(
        [[TILE_AIR], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT]],
        2,
      ),
    ).toEqual([[0], [0], [0], [1], [1]]);
  });

  it('should count the depth in each column on its own', () => {
    expect(
      cellsIn(
        [
          [TILE_DIRT, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
          [TILE_DIRT, TILE_DIRT],
        ],
        2,
      ),
    ).toEqual([
      [0, 0],
      [0, 0],
      [1, 0],
    ]);
  });

  it('should not mark a solid tile that is not dirt', () => {
    expect(
      cellsIn([[TILE_DIRT], [TILE_DIRT], [TILE_BRICK], [TILE_DIRT]], 2),
    ).toEqual([[0], [0], [0], [1]]);
  });

  it('should start counting again under a gap', () => {
    expect(
      cellsIn(
        [[TILE_DIRT], [TILE_DIRT], [TILE_SPIKE], [TILE_DIRT], [TILE_DIRT]],
        1,
      ),
    ).toEqual([[0], [1], [0], [0], [1]]);
  });

  it('should keep the grid the same when it marks the dirt', () => {
    const tiles: Tile[][] = [[TILE_DIRT]];

    expect(findDeepDirt({ tiles, depth: 1 }).tiles).toBe(tiles);
  });
});
