import { TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_END, STRUCTURE_START } from '../../consts';
import { isEmptyCell } from './is-empty-cell';

describe('isEmptyCell', () => {
  it('should return true when the cell is air', () => {
    expect(isEmptyCell(TILE_AIR)).toBe(true);
  });

  it('should return true when the cell is a start or end marker', () => {
    expect(isEmptyCell(STRUCTURE_START)).toBe(true);
    expect(isEmptyCell(STRUCTURE_END)).toBe(true);
  });

  it('should return false when the cell is a block or a hazard', () => {
    expect(isEmptyCell(TILE_DIRT)).toBe(false);
    expect(isEmptyCell(TILE_SPIKE)).toBe(false);
  });
});
