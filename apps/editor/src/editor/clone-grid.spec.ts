import { describe, expect, it } from 'vitest';

import { cloneGrid } from './clone-grid';

describe('cloneGrid', () => {
  it('should copy every row when it is given a grid', () => {
    const grid = [
      [1, 2],
      [3, 4],
    ];

    const copy = cloneGrid(grid);

    expect(copy).toEqual(grid);
    expect(copy).not.toBe(grid);
    expect(copy[0]).not.toBe(grid[0]);
  });

  it('should give an empty grid when the grid is empty', () => {
    expect(cloneGrid([])).toEqual([]);
  });
});
