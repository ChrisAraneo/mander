import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import type { Spot } from '../../types/spot';
import { filterChestCandidates } from './filter-chest-candidates';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  P: TILE_PORTAL,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const filterCandidates = (
  rows: string[],
  candidates: Spot[],
  levelType: LevelType,
) =>
  filterChestCandidates({ tiles: createGrid(rows), levelType, candidates })
    .candidates;

const filterColumns = (rows: string[], columns: number[]): number[] =>
  map(
    filterCandidates(
      rows,
      map(columns, (column) => ({ row: 2, column })),
      'HORIZONTAL',
    ),
    'column',
  );

const filterRows = (rows: string[], spotRows: number[]): number[] =>
  map(
    filterCandidates(
      rows,
      map(spotRows, (row) => ({ row, column: 0 })),
      'VERTICAL',
    ),
    'row',
  );

describe('filterChestCandidates', () => {
  it('should keep the columns at least two left of the portal in a horizontal level when it has one', () => {
    expect(filterColumns(['.....P.', '.....P.', '#######'], range(7))).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('should count from the right edge in a horizontal level when it has no portal', () => {
    expect(filterColumns(['......', '######'], range(6))).toEqual([0, 1, 2, 3]);
  });

  it('should keep no columns in a horizontal level when the portal is too near the left edge', () => {
    expect(filterColumns(['.P....', '.P....', '######'], range(6))).toEqual([]);
  });

  it('should keep the rows at least two below the top of the portal in a vertical level when it has one', () => {
    expect(
      filterRows(
        ['.....', '..P..', '..P..', '#####', '.....', '#####'],
        [0, 2, 3, 5],
      ),
    ).toEqual([3, 5]);
  });

  it('should count from the top row in a vertical level when it has no portal', () => {
    expect(filterRows(['...', '###', '...', '###'], [1, 3])).toEqual([3]);
  });

  it('should give nothing back in a horizontal level when there are no candidates', () => {
    expect(filterCandidates(['..P.', '####'], [], 'HORIZONTAL')).toEqual([]);
  });

  it('should give nothing back in a vertical level when there are no candidates', () => {
    expect(filterCandidates(['..P.', '####'], [], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it filters', () => {
    const tiles = createGrid(['..', '##']);

    expect(
      filterChestCandidates({ tiles, levelType: 'HORIZONTAL', candidates: [] })
        .tiles,
    ).toBe(tiles);
  });

  it('should pass the level type on when it filters', () => {
    expect(
      filterChestCandidates({
        tiles: [],
        levelType: 'VERTICAL',
        candidates: [],
      }).levelType,
    ).toBe('VERTICAL');
  });
});
