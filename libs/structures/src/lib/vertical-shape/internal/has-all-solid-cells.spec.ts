import { TILE_AIR, TILE_DIRT, TILE_STONE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasAllSolidCells } from './has-all-solid-cells';

const STRUCTURE = [
  [TILE_DIRT, TILE_STONE, TILE_AIR],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('hasAllSolidCells', () => {
  it('should return true when every given cell in the row is solid', () => {
    expect(hasAllSolidCells(STRUCTURE, 0, [0, 1])).toBe(true);
  });

  it('should return false when one of the given cells is air', () => {
    expect(hasAllSolidCells(STRUCTURE, 0, [1, 2])).toBe(false);
  });

  it('should return false when the row lies outside the structure', () => {
    expect(hasAllSolidCells(STRUCTURE, 5, [0])).toBe(false);
  });

  it('should return true when no columns are given', () => {
    expect(hasAllSolidCells(STRUCTURE, 1, [])).toBe(true);
  });
});
