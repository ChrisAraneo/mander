import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasAllEmptyCells } from './has-all-empty-cells';

const STRUCTURE = [
  [TILE_AIR, TILE_AIR, TILE_DIRT],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('hasAllEmptyCells', () => {
  it('should find the whole patch empty when every given spot is air', () => {
    expect(hasAllEmptyCells(STRUCTURE, [0, 1], [0, 1])).toBe(true);
  });

  it('should find the patch not empty when one of the given spots holds a block', () => {
    expect(hasAllEmptyCells(STRUCTURE, [0, 1], [1, 2])).toBe(false);
  });

  it('should treat the spots outside the structure as air when the rows or columns run past it', () => {
    expect(hasAllEmptyCells(STRUCTURE, [5], [0, 9])).toBe(true);
  });

  it('should find the patch empty when no rows or columns are given', () => {
    expect(hasAllEmptyCells(STRUCTURE, [], [])).toBe(true);
  });
});
