import { type Tile, TILE_AIR } from '@mander/model';
import {
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { find, pick, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { TilePatch } from '../../types/tile-patch';
import { getPlacementAfter } from './get-placement-after';

const createSector = (marks: TilePatch[]): Sector => [
  times(STRUCTURE_HEIGHT, (row) =>
    times(
      STRUCTURE_WIDTH,
      (column): Tile =>
        find(marks, (mark) => mark.row === row && mark.column === column)
          ?.tile ?? TILE_AIR,
    ),
  ),
  [],
];

const PLAIN_SECTOR = createSector([]);

const ENDING_SECTOR = createSector([
  { row: 10, column: 19, tile: STRUCTURE_END },
]);

const STARTING_SECTOR = createSector([
  { row: 12, column: 0, tile: STRUCTURE_START },
]);

describe('getPlacementAfter', () => {
  it('should put the structure right after the last one when neither carries markers', () => {
    expect(
      pick(
        getPlacementAfter(
          { structure: PLAIN_SECTOR, row: 3, column: 40 },
          PLAIN_SECTOR,
        ),
        ['row', 'column'],
      ),
    ).toEqual({ row: 3, column: 40 + STRUCTURE_WIDTH });
  });

  it('should line the start up with the end of the last one when both carry markers', () => {
    expect(
      pick(
        getPlacementAfter(
          { structure: ENDING_SECTOR, row: 0, column: 0 },
          STARTING_SECTOR,
        ),
        ['row', 'column'],
      ),
    ).toEqual({ row: -2, column: STRUCTURE_WIDTH });
  });

  it('should take the bottom right corner as the end when the last structure has no end marker', () => {
    expect(
      pick(
        getPlacementAfter(
          { structure: PLAIN_SECTOR, row: 0, column: 0 },
          STARTING_SECTOR,
        ),
        ['row', 'column'],
      ),
    ).toEqual({ row: STRUCTURE_HEIGHT - 1 - 12, column: STRUCTURE_WIDTH });
  });

  it('should take the bottom left corner as the start when the structure has no start marker', () => {
    expect(
      pick(
        getPlacementAfter(
          { structure: ENDING_SECTOR, row: 0, column: 0 },
          PLAIN_SECTOR,
        ),
        ['row', 'column'],
      ),
    ).toEqual({ row: 10 - (STRUCTURE_HEIGHT - 1), column: STRUCTURE_WIDTH });
  });

  it('should take the highest marker when the structure carries two', () => {
    expect(
      getPlacementAfter(
        { structure: PLAIN_SECTOR, row: 0, column: 0 },
        createSector([
          { row: 5, column: 0, tile: STRUCTURE_START },
          { row: 12, column: 0, tile: STRUCTURE_START },
        ]),
      ).row,
    ).toBe(STRUCTURE_HEIGHT - 1 - 5);
  });

  it('should keep the structure it places when it works out where it goes', () => {
    expect(
      getPlacementAfter(
        { structure: PLAIN_SECTOR, row: 0, column: 0 },
        STARTING_SECTOR,
      ).structure,
    ).toBe(STARTING_SECTOR);
  });
});
