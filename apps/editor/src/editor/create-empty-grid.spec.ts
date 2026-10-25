import { TILE_AIR } from '@mander/model';
import {
  STRUCTURE_HEIGHT,
  STRUCTURE_WIDTH,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { every, flatten, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createEmptyGrid } from './create-empty-grid';

describe('createEmptyGrid', () => {
  it('should fill a sector with air when the pool is a horizontal one', () => {
    const grid = createEmptyGrid('hard');

    expect(size(grid)).toBe(STRUCTURE_HEIGHT);
    expect(every(grid, (row) => size(row) === STRUCTURE_WIDTH)).toBe(true);
    expect(every(flatten(grid), (cell) => cell === TILE_AIR)).toBe(true);
  });

  it('should be as tall as a vertical sector when the pool is the vertical one', () => {
    expect(size(createEmptyGrid('vertical'))).toBe(VERTICAL_HEIGHT);
  });

  it('should make a normal sector when no pool is given', () => {
    expect(createEmptyGrid()).toEqual(createEmptyGrid('normal'));
  });
});
