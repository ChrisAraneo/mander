import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findDeepDirt } from './find-deep-dirt';

const findCells = (tiles: Tile[][], depth: number) =>
  findDeepDirt({ tiles, depth }).cells;

describe('findDeepDirt', () => {
  it('should mark the dirt when it lies at the dirt depth or deeper', () => {
    expect(
      findCells(
        [[TILE_AIR], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT]],
        2,
      ),
    ).toEqual([[0], [0], [0], [1], [1]]);
  });

  it('should count the depth in each column on its own when the columns differ', () => {
    expect(
      findCells(
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

  it('should not mark a solid tile when it is not dirt', () => {
    expect(
      findCells([[TILE_DIRT], [TILE_DIRT], [TILE_BRICK], [TILE_DIRT]], 2),
    ).toEqual([[0], [0], [0], [1]]);
  });

  it('should start counting again when there is a gap above', () => {
    expect(
      findCells(
        [[TILE_DIRT], [TILE_DIRT], [TILE_SPIKE], [TILE_DIRT], [TILE_DIRT]],
        1,
      ),
    ).toEqual([[0], [1], [0], [0], [1]]);
  });

  it('should mark nothing when the grid is empty', () => {
    expect(findCells([], 1)).toEqual([]);
  });

  it('should keep the grid the same when it marks the dirt', () => {
    const tiles: Tile[][] = [[TILE_DIRT]];

    expect(findDeepDirt({ tiles, depth: 1 }).tiles).toBe(tiles);
  });
});
