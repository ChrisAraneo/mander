import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findSurfaceRows } from './find-surface-rows';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) => (cell === '#' ? TILE_DIRT : TILE_AIR)),
  );

// column 0 and 1 stand on the floor, 2 stands on a ledge, 3 and 5 sit too
// close to the top of the grid, and 6 has nothing under it at all
const LEVEL = grid(['.....#.', '...#...', '..#....', '######.']);

describe('findSurfaceRows', () => {
  it('should give the two rows above the floor when the column has space', () => {
    expect(findSurfaceRows(LEVEL, 0)).toEqual([2, 1]);
  });

  it('should give the lowest row first when it looks up from the floor', () => {
    expect(findSurfaceRows(LEVEL, 1)).toEqual([2, 1]);
  });

  it('should start from the top block when the column has more than one', () => {
    expect(findSurfaceRows(LEVEL, 2)).toEqual([1, 0]);
  });

  it('should give nothing when there is only one row above the floor', () => {
    expect(findSurfaceRows(LEVEL, 3)).toEqual([]);
  });

  it('should give nothing when the block is in the top row', () => {
    expect(findSurfaceRows(LEVEL, 5)).toEqual([]);
  });

  it('should give nothing when the column has no block to stand on', () => {
    expect(findSurfaceRows(LEVEL, 6)).toEqual([]);
  });

  it('should give nothing when the grid is empty', () => {
    expect(findSurfaceRows([], 0)).toEqual([]);
  });
});
