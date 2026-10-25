import { type Tile, TILE_AIR } from '@mander/model';
import {
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { find, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { TilePatch } from '../../types/tile-patch';
import { findMarker } from './find-marker';

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

describe('findMarker', () => {
  it('should give the cell of the marker when the structure carries it', () => {
    expect(
      findMarker(
        createSector([{ row: 10, column: 19, tile: STRUCTURE_END }]),
        STRUCTURE_END,
      ),
    ).toEqual({ row: 10, column: 19 });
  });

  it('should give the highest cell when the structure carries the marker twice', () => {
    expect(
      findMarker(
        createSector([
          { row: 12, column: 0, tile: STRUCTURE_START },
          { row: 5, column: 3, tile: STRUCTURE_START },
        ]),
        STRUCTURE_START,
      ),
    ).toEqual({ row: 5, column: 3 });
  });

  it('should give nothing when the structure carries only another marker', () => {
    expect(
      findMarker(
        createSector([{ row: 10, column: 19, tile: STRUCTURE_END }]),
        STRUCTURE_START,
      ),
    ).toBeUndefined();
  });

  it('should give nothing when the structure is empty', () => {
    expect(findMarker([[], []], STRUCTURE_START)).toBeUndefined();
  });
});
