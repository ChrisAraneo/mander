import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeMiddleColumn } from './compute-middle-column';

const createRow = (width: number): Tile[] => times(width, () => TILE_AIR);

describe('computeMiddleColumn', () => {
  it('should give the center column when the width is odd', () => {
    expect(computeMiddleColumn([createRow(5)])).toBe(2);
  });

  it('should give the right one of the two center columns when the width is even', () => {
    expect(computeMiddleColumn([createRow(4)])).toBe(2);
  });

  it('should give the first column when the grid is one column wide', () => {
    expect(computeMiddleColumn([createRow(1)])).toBe(0);
  });

  it('should use the width of the first row when the rows are not the same width', () => {
    expect(computeMiddleColumn([createRow(3), createRow(7)])).toBe(1);
  });

  it('should give the first column when the grid is empty', () => {
    expect(computeMiddleColumn([])).toBe(0);
  });
});
