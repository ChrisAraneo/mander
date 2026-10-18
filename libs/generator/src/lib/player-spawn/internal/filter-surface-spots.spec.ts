import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { filterSurfaceSpots } from './filter-surface-spots';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('filterSurfaceSpots', () => {
  it('should give the top block of each column when there is room above it', () => {
    expect(filterSurfaceSpots(createGrid(['..', '..', '##']))).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
    ]);
  });

  it('should give the ledge and not the floor under it when a column has both', () => {
    expect(
      filterSurfaceSpots(
        createGrid(['...', '...', '.#.', '...', '...', '###']),
      ),
    ).toEqual([
      { row: 2, column: 1 },
      { row: 5, column: 0 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a column when a block hangs over its floor', () => {
    expect(
      filterSurfaceSpots(createGrid(['#..', '...', '...', '###'])),
    ).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column when something is in the way above its top block', () => {
    expect(filterSurfaceSpots(createGrid(['..', 'o.', '##']))).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should skip a column when its top block has only one row above it', () => {
    expect(filterSurfaceSpots(createGrid(['..', '#.', '##']))).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should give no spots when there is nothing to stand on', () => {
    expect(filterSurfaceSpots(createGrid(['..', '..']))).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterSurfaceSpots([])).toEqual([]);
  });
});
