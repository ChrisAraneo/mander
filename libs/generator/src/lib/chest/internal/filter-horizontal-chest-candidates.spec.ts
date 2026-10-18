import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { filterHorizontalChestCandidates } from './filter-horizontal-chest-candidates';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  P: TILE_PORTAL,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const filterColumns = (rows: string[], columns: number[]): number[] =>
  map(
    filterHorizontalChestCandidates(
      createGrid(rows),
      map(columns, (column) => ({ row: 2, column })),
    ),
    (candidate) => candidate.column,
  );

describe('filterHorizontalChestCandidates', () => {
  it('should keep the columns at least two left of the portal when the grid has one', () => {
    expect(filterColumns(['.....P.', '.....P.', '#######'], range(7))).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('should count from the right edge when the grid has no portal', () => {
    expect(filterColumns(['......', '######'], range(6))).toEqual([0, 1, 2, 3]);
  });

  it('should keep no columns when the portal is too near the left edge', () => {
    expect(filterColumns(['.P....', '.P....', '######'], range(6))).toEqual([]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(filterColumns(['..P.', '####'], [])).toEqual([]);
  });
});
