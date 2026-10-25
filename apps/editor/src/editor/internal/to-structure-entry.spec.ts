import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toStructureEntry } from './to-structure-entry';

describe('toStructureEntry', () => {
  it('should read the text of the entry into a sketch when the entry holds a grid', () => {
    expect(
      toStructureEntry({
        name: 'HARD_001',
        pool: 'hard',
        text: '[\n  [\n    [__, DR],\n  ],\n  [],\n]',
      }),
    ).toEqual({
      name: 'HARD_001',
      pool: 'hard',
      sketch: { tiles: [[TILE_AIR, TILE_DIRT]], backTiles: [] },
    });
  });

  it('should give an empty sketch when the text is empty', () => {
    expect(
      toStructureEntry({ name: 'NORMAL_001', pool: 'normal', text: '' }).sketch,
    ).toEqual({ tiles: [], backTiles: [] });
  });
});
