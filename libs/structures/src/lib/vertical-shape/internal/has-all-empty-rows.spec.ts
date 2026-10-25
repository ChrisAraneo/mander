import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_END } from '../../consts';
import { hasAllEmptyRows } from './has-all-empty-rows';

const STRUCTURE = [
  [TILE_AIR, STRUCTURE_END],
  [TILE_AIR, TILE_DIRT],
  [TILE_AIR, TILE_AIR],
];

describe('hasAllEmptyRows', () => {
  it('should return true when every row holds only air and markers', () => {
    expect(hasAllEmptyRows(STRUCTURE, [0, 2])).toBe(true);
  });

  it('should return false when one of the rows holds a block', () => {
    expect(hasAllEmptyRows(STRUCTURE, [0, 1])).toBe(false);
  });

  it('should return true when no rows are given', () => {
    expect(hasAllEmptyRows(STRUCTURE, [])).toBe(true);
  });
});
