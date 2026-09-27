import { TILE_AIR, TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findAnchorRow } from './find-anchor-row';

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'P' ? TILE_PORTAL : TILE_AIR,
    ),
  );

describe('findAnchorRow', () => {
  it('should give the top row of the portal when the grid has one', () => {
    expect(
      findAnchorRow(createGrid(['.....', '..P..', '..P..', '#####'])),
    ).toBe(1);
  });

  it('should use the highest portal tile when portal tiles are in more than one place', () => {
    expect(
      findAnchorRow(createGrid(['.....', '....P', '.P...', '#####'])),
    ).toBe(1);
  });

  it('should give the top row when the grid has no portal', () => {
    expect(findAnchorRow(createGrid(['...', '...', '###']))).toBe(0);
  });

  it('should give the top row when the grid is empty', () => {
    expect(findAnchorRow([])).toBe(0);
  });
});
