import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasAllEmptyCells } from './has-all-empty-cells';

const STRUCTURE = [
  [TILE_AIR, TILE_AIR, TILE_DIRT],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

describe('hasAllEmptyCells', () => {
  it('should return true when every given cell is empty', () => {
    expect(hasAllEmptyCells(STRUCTURE, [0, 1], [0, 1])).toBe(true);
  });

  it('should return false when one of the given cells holds a block', () => {
    expect(hasAllEmptyCells(STRUCTURE, [0, 1], [1, 2])).toBe(false);
  });

  it('should treat cells outside the structure as air when the rows or columns run past it', () => {
    expect(hasAllEmptyCells(STRUCTURE, [5], [0, 9])).toBe(true);
  });
});
