import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { toStructureTiles } from './to-structure-tiles';

describe('toStructureTiles', () => {
  it('should turn the markers into air and keep the other tiles when the grid holds both', () => {
    expect(
      toStructureTiles([
        [STRUCTURE_START, TILE_DIRT],
        [TILE_DIRT, TILE_AIR],
      ]),
    ).toEqual([
      [TILE_AIR, TILE_DIRT],
      [TILE_DIRT, TILE_AIR],
    ]);
  });

  it('should give no rows when the grid is empty', () => {
    expect(toStructureTiles([])).toEqual([]);
  });
});
