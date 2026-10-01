import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findSurfaceSpots } from './find-surface-spots';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('findSurfaceSpots', () => {
  it('should give the top block of each column when there is room above it', () => {
    expect(findSurfaceSpots(createGrid(['..', '..', '##']))).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
    ]);
  });

  it('should give the ledge and not the floor under it when a column has both', () => {
    expect(
      findSurfaceSpots(createGrid(['...', '...', '.#.', '...', '...', '###'])),
    ).toEqual([
      { row: 2, column: 1 },
      { row: 5, column: 0 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a column when a block hangs over its floor', () => {
    expect(findSurfaceSpots(createGrid(['#..', '...', '...', '###']))).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column when something is in the way above its top block', () => {
    expect(findSurfaceSpots(createGrid(['..', 'o.', '##']))).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should skip a column when its top block has only one row above it', () => {
    expect(findSurfaceSpots(createGrid(['..', '#.', '##']))).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should give no spots when there is nothing to stand on', () => {
    expect(findSurfaceSpots(createGrid(['..', '..']))).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(findSurfaceSpots([])).toEqual([]);
  });
});
