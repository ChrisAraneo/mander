import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isSurface } from './is-surface';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('isSurface', () => {
  it('should say yes when the block is the top block of its column', () => {
    expect(isSurface(createGrid(['.', '.', '#']), 2, 0)).toBe(true);
  });

  it('should say no when there is another block higher up in the same column', () => {
    expect(isSurface(createGrid(['#', '.', '#']), 2, 0)).toBe(false);
  });

  it('should say no when the row is above the top block', () => {
    expect(isSurface(createGrid(['.', '.', '#']), 1, 0)).toBe(false);
  });

  it('should say no when the column has no blocks', () => {
    expect(isSurface(createGrid(['.', '.']), 1, 0)).toBe(false);
  });

  it('should only look at its own column when another column is taller', () => {
    expect(isSurface(createGrid(['.#', '.#', '##']), 2, 0)).toBe(true);
  });

  it('should say yes when only a pickup sits above the block', () => {
    expect(isSurface(createGrid(['o', '.', '#']), 2, 0)).toBe(true);
  });

  it('should say no when the grid is empty', () => {
    expect(isSurface([], 0, 0)).toBe(false);
  });
});
