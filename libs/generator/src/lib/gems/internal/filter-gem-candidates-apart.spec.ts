import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import type { Spot } from '../../types/spot';
import { filterGemCandidatesApart } from './filter-gem-candidates-apart';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const filterFrom = (slots: Spot[][], levelType: LevelType) =>
  filterGemCandidatesApart({ tiles: LEVEL, levelType, slots }).candidates;

describe('filterGemCandidatesApart', () => {
  it('should pick the first candidate of each slot when they stand far apart', () => {
    expect(
      filterFrom(
        [
          [
            { row: 5, column: 0 },
            { row: 5, column: 1 },
          ],
          [
            { row: 5, column: 8 },
            { row: 5, column: 9 },
          ],
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 5, column: 0 },
      { row: 5, column: 8 },
    ]);
  });

  it('should take the next candidate of a slot in a horizontal level when the first is in the column next to a picked one', () => {
    expect(
      filterFrom(
        [
          [{ row: 5, column: 3 }],
          [
            { row: 5, column: 4 },
            { row: 5, column: 6 },
          ],
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 5, column: 3 },
      { row: 5, column: 6 },
    ]);
  });

  it('should take the next candidate of a slot in a horizontal level when the first is in the next column but stands higher', () => {
    expect(
      filterFrom(
        [
          [{ row: 5, column: 3 }],
          [
            { row: 2, column: 4 },
            { row: 5, column: 6 },
          ],
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 5, column: 3 },
      { row: 5, column: 6 },
    ]);
  });

  it('should take a candidate in a vertical level when it is in the next column but two rows away from a picked one', () => {
    expect(
      filterFrom(
        [[{ row: 5, column: 3 }], [{ row: 7, column: 4 }]],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 5, column: 3 },
      { row: 7, column: 4 },
    ]);
  });

  it('should take the next candidate of a slot in a vertical level when the first touches a picked one', () => {
    expect(
      filterFrom(
        [
          [{ row: 5, column: 3 }],
          [
            { row: 6, column: 4 },
            { row: 9, column: 4 },
          ],
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 5, column: 3 },
      { row: 9, column: 4 },
    ]);
  });

  it('should pick nothing from a slot when none of its candidates is apart from the picked ones', () => {
    expect(
      filterFrom(
        [
          [{ row: 5, column: 3 }],
          [
            { row: 5, column: 2 },
            { row: 5, column: 4 },
          ],
        ],
        'HORIZONTAL',
      ),
    ).toEqual([{ row: 5, column: 3 }]);
  });

  it('should pick nothing from a slot when it is empty', () => {
    expect(filterFrom([[], [{ row: 5, column: 1 }]], 'VERTICAL')).toEqual([
      { row: 5, column: 1 },
    ]);
  });

  it('should pick nothing when there are no slots', () => {
    expect(filterFrom([], 'HORIZONTAL')).toEqual([]);
  });

  it('should keep the grid the same when it picks', () => {
    expect(
      filterGemCandidatesApart({
        tiles: LEVEL,
        levelType: 'HORIZONTAL',
        slots: [],
      }).tiles,
    ).toBe(LEVEL);
  });
});
