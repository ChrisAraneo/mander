import { TILE_AIR, type Tile } from '@mander/model';
import { VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GEMS_PER_STRUCTURE } from '../../consts';
import { splitIntoRowSlots } from './split-into-row-slots';

const createLevel = (height: number): Tile[][] =>
  times(height, () => [TILE_AIR]);

const splitRows = (height: number, rows: number[]): number[][] =>
  map(
    splitIntoRowSlots(
      createLevel(height),
      map(rows, (row) => ({ row, column: 0 })),
    ),
    (slot) => map(slot, 'row'),
  );

describe('splitIntoRowSlots', () => {
  it('should give each gem of a band its own slot of rows when the level is one band tall', () => {
    expect(
      splitRows(VERTICAL_BAND_HEIGHT, range(VERTICAL_BAND_HEIGHT)),
    ).toEqual([
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
      [17, 18, 19, 20],
    ]);
  });

  it('should keep going up the next band when the level is two bands tall', () => {
    expect(
      splitRows(VERTICAL_BAND_HEIGHT * 2, range(VERTICAL_BAND_HEIGHT * 2)),
    ).toHaveLength(GEMS_PER_STRUCTURE * 2);
  });

  it('should cut the last slot short when the level ends inside it', () => {
    expect(splitRows(10, range(10))).toEqual([
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8],
      [9],
    ]);
  });

  it('should leave a slot empty when none of its rows has a candidate', () => {
    expect(splitRows(10, [1, 9])).toEqual([[1], [], [9]]);
  });

  it('should keep the candidates of a slot in the order they came when several share its rows', () => {
    expect(
      splitIntoRowSlots(createLevel(4), [
        { row: 1, column: 2 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
      ]),
    ).toEqual([
      [
        { row: 1, column: 2 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
      ],
    ]);
  });

  it('should give no slots when the grid is empty', () => {
    expect(splitIntoRowSlots([], [])).toEqual([]);
  });
});
