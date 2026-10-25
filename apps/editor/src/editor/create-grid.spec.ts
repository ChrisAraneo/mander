import { TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  VERTICAL_END_ROW,
  VERTICAL_HEIGHT,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { every, last, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createGrid } from './create-grid';

describe('createGrid', () => {
  it('should lay dirt along the bottom row and air above it when the pool is a horizontal one', () => {
    const grid = createGrid('normal');

    expect(size(grid)).toBe(STRUCTURE_HEIGHT);
    expect(last(grid)).toEqual(times(STRUCTURE_WIDTH, () => TILE_DIRT));
    expect(every(grid[0], (cell) => cell === TILE_AIR)).toBe(true);
  });

  it('should mark the start and the end and lay the launch platform when the pool is the vertical one', () => {
    const grid = createGrid('vertical');

    expect(size(grid)).toBe(VERTICAL_HEIGHT);
    expect(grid[VERTICAL_START_ROW][VERTICAL_MARKER_COLUMN]).toBe(
      STRUCTURE_START,
    );
    expect(grid[VERTICAL_END_ROW][VERTICAL_MARKER_COLUMN]).toBe(STRUCTURE_END);
    expect(
      every(
        VERTICAL_PLATFORM_COLUMNS,
        (column) => grid[VERTICAL_LAUNCH_ROW][column] === TILE_DIRT,
      ),
    ).toBe(true);
  });

  it('should make a normal sector when no pool is given', () => {
    expect(createGrid()).toEqual(createGrid('normal'));
  });
});
