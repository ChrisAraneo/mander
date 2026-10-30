import { TILE_AIR, TILE_DIRT, TILE_ENEMY, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isAirborneCell } from './is-airborne-cell';

const GRID: Tile[][] = [
  [TILE_ENEMY, TILE_ENEMY],
  [TILE_DIRT, TILE_AIR],
];

describe('isAirborneCell', () => {
  it('should leave the cell on the ground when a block holds it up', () => {
    expect(isAirborneCell(GRID, { row: 0, column: 0 })).toBe(false);
  });

  it('should put the cell in the air when nothing holds it up', () => {
    expect(isAirborneCell(GRID, { row: 0, column: 1 })).toBe(true);
  });

  it('should put the cell in the air when it sits on the bottom row', () => {
    expect(isAirborneCell(GRID, { row: 1, column: 0 })).toBe(true);
  });

  it('should put the cell in the air when the row below is shorter than it', () => {
    expect(
      isAirborneCell([[TILE_ENEMY, TILE_ENEMY], [TILE_DIRT]], {
        row: 0,
        column: 1,
      }),
    ).toBe(true);
  });
});
