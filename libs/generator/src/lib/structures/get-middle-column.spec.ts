import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getMiddleColumn } from './get-middle-column';

const row = (width: number): Tile[] => times(width, () => TILE_AIR);

describe('getMiddleColumn', () => {
  it('should give the center column when the width is odd', () => {
    expect(getMiddleColumn([row(5)])).toBe(2);
  });

  it('should give the right one of the two center columns when the width is even', () => {
    expect(getMiddleColumn([row(4)])).toBe(2);
  });

  it('should give the first column when the grid is one column wide', () => {
    expect(getMiddleColumn([row(1)])).toBe(0);
  });

  it('should use the width of the first row when the rows are not the same width', () => {
    expect(getMiddleColumn([row(3), row(7)])).toBe(1);
  });

  it('should give the first column when the grid is empty', () => {
    expect(getMiddleColumn([])).toBe(0);
  });
});
