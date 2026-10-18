import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { filterVerticalChestCandidates } from './filter-vertical-chest-candidates';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  P: TILE_PORTAL,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const filterRows = (rows: string[], spotRows: number[]): number[] =>
  map(
    filterVerticalChestCandidates(
      createGrid(rows),
      map(spotRows, (row) => ({ row, column: 0 })),
    ),
    (candidate) => candidate.row,
  );

describe('filterVerticalChestCandidates', () => {
  it('should keep the rows at least two below the top of the portal when the grid has one', () => {
    expect(
      filterRows(
        ['.....', '..P..', '..P..', '#####', '.....', '#####'],
        [0, 2, 3, 5],
      ),
    ).toEqual([3, 5]);
  });

  it('should count from the top row when the grid has no portal', () => {
    expect(filterRows(['...', '###', '...', '###'], [1, 3])).toEqual([3]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(filterRows(['..P.', '####'], [])).toEqual([]);
  });
});
