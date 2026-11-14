import { TILE_AIR, TILE_DIRT, TILE_STONE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasAllSolidCells } from './has-all-solid-cells';

const STRUCTURE = [
  [TILE_DIRT, TILE_STONE, TILE_AIR],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('hasAllSolidCells', () => {
  it('should find the row solid when every given spot in it holds a block', () => {
    expect(hasAllSolidCells(STRUCTURE, 0, [0, 1])).toBe(true);
  });

  it('should find the row not solid when one of the given spots is air', () => {
    expect(hasAllSolidCells(STRUCTURE, 0, [1, 2])).toBe(false);
  });

  it('should find the row not solid when it lies outside the structure', () => {
    expect(hasAllSolidCells(STRUCTURE, 5, [0])).toBe(false);
  });

  it('should find the row solid when no columns are given', () => {
    expect(hasAllSolidCells(STRUCTURE, 1, [])).toBe(true);
  });
});
