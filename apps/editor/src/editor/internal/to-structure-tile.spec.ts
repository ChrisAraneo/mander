import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { toStructureTile } from './to-structure-tile';

describe('toStructureTile', () => {
  it('should give air when the cell is the start', () => {
    expect(toStructureTile(STRUCTURE_START)).toBe(TILE_AIR);
  });

  it('should give air when the cell is the end', () => {
    expect(toStructureTile(STRUCTURE_END)).toBe(TILE_AIR);
  });

  it('should keep the tile when the cell is not a marker', () => {
    expect(toStructureTile(TILE_DIRT)).toBe(TILE_DIRT);
  });
});
