import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isBlank } from './is-blank';

describe('isBlank', () => {
  it('should find the grid blank when every cell is air', () => {
    expect(isBlank([[TILE_AIR, TILE_AIR], [TILE_AIR]])).toBe(true);
  });

  it('should not find the grid blank when a cell is painted', () => {
    expect(isBlank([[TILE_AIR, TILE_BRICK]])).toBe(false);
  });

  it('should find the grid blank when it is empty', () => {
    expect(isBlank([])).toBe(true);
  });
});
