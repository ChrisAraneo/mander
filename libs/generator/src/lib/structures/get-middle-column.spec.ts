import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getMiddleColumn } from './get-middle-column';

const createRow = (width: number): Tile[] => times(width, () => TILE_AIR);

describe('getMiddleColumn', () => {
  it('should give the center column when the width is odd', () => {
    expect(getMiddleColumn([createRow(5)])).toBe(2);
  });

  it('should give the right one of the two center columns when the width is even', () => {
    expect(getMiddleColumn([createRow(4)])).toBe(2);
  });

  it('should give the first column when the grid is one column wide', () => {
    expect(getMiddleColumn([createRow(1)])).toBe(0);
  });

  it('should use the width of the first row when the rows are not the same width', () => {
    expect(getMiddleColumn([createRow(3), createRow(7)])).toBe(1);
  });

  it('should give the first column when the grid is empty', () => {
    expect(getMiddleColumn([])).toBe(0);
  });
});
