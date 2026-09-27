import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findAnchorColumn } from './find-anchor-column';

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'P' ? TILE_PORTAL : TILE_AIR,
    ),
  );

describe('findAnchorColumn', () => {
  it('should give the column of the portal when the grid has one', () => {
    expect(findAnchorColumn(createGrid(['...P.', '...P.', '#####']))).toBe(3);
  });

  it('should use the highest portal tile when portal tiles are in more than one column', () => {
    expect(findAnchorColumn(createGrid(['.....', '...P.', 'P....']))).toBe(3);
  });

  it('should use the leftmost portal tile when a row has more than one', () => {
    expect(findAnchorColumn(createGrid(['.P.P.', '#####']))).toBe(1);
  });

  it('should give the last column when the grid has no portal', () => {
    expect(findAnchorColumn(createGrid(['....', '####']))).toBe(3);
  });

  it('should give minus one when the grid is empty', () => {
    expect(findAnchorColumn([])).toBe(-1);
  });
});
