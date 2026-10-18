import { TILE_AIR, type Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { chunk, map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GEMS_PER_STRUCTURE, SLOT_WIDTH } from '../../consts';
import { splitIntoColumnSlots } from './split-into-column-slots';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const splitColumns = (width: number, columns: number[]): number[][] =>
  map(
    splitIntoColumnSlots(
      createLevel(width),
      map(columns, (column) => ({ row: 5, column })),
    ),
    (slot) => map(slot, 'column'),
  );

describe('splitIntoColumnSlots', () => {
  it('should give each gem of a structure its own slot of columns when the level is one structure wide', () => {
    expect(splitColumns(STRUCTURE_WIDTH, range(STRUCTURE_WIDTH))).toEqual(
      chunk(range(STRUCTURE_WIDTH), SLOT_WIDTH),
    );
  });

  it('should keep going across the next structure when the level is two structures wide', () => {
    expect(
      splitColumns(STRUCTURE_WIDTH * 2, range(STRUCTURE_WIDTH * 2)),
    ).toHaveLength(GEMS_PER_STRUCTURE * 2);
  });

  it('should cut the last slot short when the level ends inside it', () => {
    expect(splitColumns(10, range(10))).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9],
    ]);
  });

  it('should leave a slot empty when none of its columns has a candidate', () => {
    expect(splitColumns(12, [1, 9])).toEqual([[1], [], [9]]);
  });

  it('should put the candidates of a slot in order from left to right when they stand at different heights', () => {
    expect(
      splitIntoColumnSlots(createLevel(4), [
        { row: 1, column: 2 },
        { row: 3, column: 0 },
        { row: 5, column: 1 },
      ]),
    ).toEqual([
      [
        { row: 3, column: 0 },
        { row: 5, column: 1 },
        { row: 1, column: 2 },
      ],
    ]);
  });

  it('should give no slots when the grid is empty', () => {
    expect(splitIntoColumnSlots([], [])).toEqual([]);
  });
});
