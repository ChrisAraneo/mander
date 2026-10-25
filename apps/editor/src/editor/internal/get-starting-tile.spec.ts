import { TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_START,
  VERTICAL_END_ROW,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { getStartingTile } from './get-starting-tile';

describe('getStartingTile', () => {
  it('should give the end when the cell is the marker cell of the top row', () => {
    expect(
      getStartingTile({
        row: VERTICAL_END_ROW,
        column: VERTICAL_MARKER_COLUMN,
      }),
    ).toBe(STRUCTURE_END);
  });

  it('should give the start when the cell is the marker cell of the bottom row', () => {
    expect(
      getStartingTile({
        row: VERTICAL_START_ROW,
        column: VERTICAL_MARKER_COLUMN,
      }),
    ).toBe(STRUCTURE_START);
  });

  it('should give dirt when the cell is part of the launch platform', () => {
    expect(
      getStartingTile({
        row: VERTICAL_LAUNCH_ROW,
        column: VERTICAL_PLATFORM_COLUMNS[0],
      }),
    ).toBe(TILE_DIRT);
  });

  it('should give air when the cell is any other cell', () => {
    expect(getStartingTile({ row: VERTICAL_END_ROW, column: 0 })).toBe(
      TILE_AIR,
    );
  });
});
