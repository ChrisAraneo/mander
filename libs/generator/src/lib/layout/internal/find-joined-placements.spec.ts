import { type Tile, TILE_AIR } from '@mander/model';
import {
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { find, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { TilePatch } from '../../types/tile-patch';
import { findJoinedPlacements } from './find-joined-placements';

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

const findPositions = (structures: Sector[]) =>
  map(findJoinedPlacements(structures), ({ row, column }) => ({
    row,
    column,
  }));

describe('findJoinedPlacements', () => {
  it('should start the first structure at the top left when it chains them', () => {
    expect(findPositions([createSector([])])).toEqual([{ row: 0, column: 0 }]);
  });

  it('should put each structure right after the last when none carries markers', () => {
    expect(
      findPositions([createSector([]), createSector([]), createSector([])]),
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: STRUCTURE_WIDTH },
      { row: 0, column: STRUCTURE_WIDTH * 2 },
    ]);
  });

  it('should drop the next structure lower when its start sits higher than the end of the last', () => {
    expect(
      findPositions([
        createSector([{ row: 15, column: 19, tile: STRUCTURE_END }]),
        createSector([{ row: 5, column: 0, tile: STRUCTURE_START }]),
      ]),
    ).toEqual([
      { row: 0, column: 0 },
      { row: 10, column: STRUCTURE_WIDTH },
    ]);
  });

  it('should shift every structure down when the next one would start above the top row', () => {
    expect(
      findPositions([
        createSector([{ row: 10, column: 19, tile: STRUCTURE_END }]),
        createSector([{ row: 12, column: 0, tile: STRUCTURE_START }]),
      ]),
    ).toEqual([
      { row: 2, column: 0 },
      { row: 0, column: STRUCTURE_WIDTH },
    ]);
  });

  it('should keep the structures in their order when it chains them', () => {
    const first = createSector([]);
    const second = createSector([]);

    const placed = findJoinedPlacements([first, second]);

    expect(placed[0].structure).toBe(first);
    expect(placed[1].structure).toBe(second);
  });

  it('should give no placements when there are no structures', () => {
    expect(findJoinedPlacements([])).toEqual([]);
  });
});
