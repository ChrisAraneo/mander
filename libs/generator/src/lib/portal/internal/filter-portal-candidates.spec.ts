import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { filterPortalCandidates } from './filter-portal-candidates';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const filterCandidates = (rows: string[], levelType: LevelType) =>
  filterPortalCandidates({ tiles: createGrid(rows), levelType }).candidates;

const TWO_FLOORS = ['...', '...', '###', '...', '...', '###'];

describe('filterPortalCandidates', () => {
  it('should give the top block of each column in a horizontal level when there is room above it', () => {
    expect(filterCandidates(['..', '..', '##'], 'HORIZONTAL')).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
    ]);
  });

  it('should stand on the ledge and not the floor under it in a horizontal level when a column has both', () => {
    expect(
      filterCandidates(
        ['...', '...', '.#.', '...', '...', '###'],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 2, column: 1 },
      { row: 5, column: 0 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when a block hangs over its floor', () => {
    expect(
      filterCandidates(['#..', '...', '...', '###'], 'HORIZONTAL'),
    ).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when something is in the way above its top block', () => {
    expect(filterCandidates(['..', 'o.', '##'], 'HORIZONTAL')).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should skip a column in a horizontal level when its top block has only one row above it', () => {
    expect(filterCandidates(['..', '#.', '##'], 'HORIZONTAL')).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should give the candidates on every floor of a vertical level when it has more than one', () => {
    expect(filterCandidates(TWO_FLOORS, 'VERTICAL')).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
      { row: 2, column: 2 },
      { row: 5, column: 0 },
      { row: 5, column: 1 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a spot in a vertical level when something is in the way above it', () => {
    expect(filterCandidates(['...', '.o.', '###'], 'VERTICAL')).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should skip a spot in a vertical level when it has only one row of room above it', () => {
    expect(filterCandidates(['.#.', '...', '###'], 'VERTICAL')).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should give no candidates in a horizontal level when there is nothing to stand on', () => {
    expect(filterCandidates(['..', '..'], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when there is nowhere to stand', () => {
    expect(filterCandidates(['...', '...', '...'], 'VERTICAL')).toEqual([]);
  });

  it('should give no candidates in a horizontal level when the grid is empty', () => {
    expect(filterCandidates([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when the grid is empty', () => {
    expect(filterCandidates([], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    const tiles = createGrid(['..', '..', '##']);

    expect(
      filterPortalCandidates({ tiles, levelType: 'HORIZONTAL' }).tiles,
    ).toBe(tiles);
  });

  it('should pass the level type on when it looks for candidates', () => {
    expect(
      filterPortalCandidates({ tiles: [], levelType: 'VERTICAL' }).levelType,
    ).toBe('VERTICAL');
  });
});
