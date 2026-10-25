import { TILE_AIR, TILE_BRICK, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchGridCell } from './patch-grid-cell';

const createGrid = (): number[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchGridCell', () => {
  it('should paint the one cell when it is given a cell of the grid', () => {
    expect(patchGridCell(createGrid(), 0, 1, TILE_BRICK)).toEqual([
      [TILE_AIR, TILE_BRICK],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should pass the other rows on as they were when it paints a cell', () => {
    const grid = createGrid();

    expect(patchGridCell(grid, 0, 1, TILE_BRICK)[1]).toBe(grid[1]);
  });

  it('should change nothing when the cell is outside the grid', () => {
    expect(patchGridCell(createGrid(), 5, 5, TILE_BRICK)).toEqual(createGrid());
  });

  it('should give an empty grid when the grid is empty', () => {
    expect(patchGridCell([], 0, 0, TILE_BRICK)).toEqual([]);
  });

  it('should not change the old grid when it paints a cell', () => {
    const grid = createGrid();

    patchGridCell(grid, 0, 1, TILE_BRICK);

    expect(grid).toEqual(createGrid());
  });
});
