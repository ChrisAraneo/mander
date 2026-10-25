import { TILE_AIR, TILE_BRICK, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { isDrawn } from './is-drawn';

describe('isDrawn', () => {
  it('should count the tile as drawn when it is a block', () => {
    expect(isDrawn(TILE_DIRT)).toBe(true);
    expect(isDrawn(TILE_BRICK)).toBe(true);
  });

  it('should not count the tile as drawn when it is empty', () => {
    expect(isDrawn(TILE_AIR)).toBe(false);
  });

  it('should not count the tile as drawn when it is the start marker', () => {
    expect(isDrawn(STRUCTURE_START)).toBe(false);
  });

  it('should not count the tile as drawn when it is the end marker', () => {
    expect(isDrawn(STRUCTURE_END)).toBe(false);
  });
});
