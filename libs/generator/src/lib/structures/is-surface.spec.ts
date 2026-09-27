import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isSurface } from './is-surface';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

describe('isSurface', () => {
  it('should say yes when the block is the top block of its column', () => {
    expect(isSurface(grid(['.', '.', '#']), 2, 0)).toBe(true);
  });

  it('should say no when there is another block higher up in the same column', () => {
    expect(isSurface(grid(['#', '.', '#']), 2, 0)).toBe(false);
  });

  it('should say no when the row is above the top block', () => {
    expect(isSurface(grid(['.', '.', '#']), 1, 0)).toBe(false);
  });

  it('should say no when the column has no blocks', () => {
    expect(isSurface(grid(['.', '.']), 1, 0)).toBe(false);
  });

  it('should only look at its own column when another column is taller', () => {
    expect(isSurface(grid(['.#', '.#', '##']), 2, 0)).toBe(true);
  });

  it('should not count a pickup above the block as a block', () => {
    expect(isSurface(grid(['o', '.', '#']), 2, 0)).toBe(true);
  });

  it('should say no when the grid is empty', () => {
    expect(isSurface([], 0, 0)).toBe(false);
  });
});
