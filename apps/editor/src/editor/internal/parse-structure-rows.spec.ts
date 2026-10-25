import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { parseStructureRows } from './parse-structure-rows';

describe('parseStructureRows', () => {
  it('should read every row with where it starts in the text when the text has rows', () => {
    expect(
      parseStructureRows(
        '[\n  [\n    [__, BR],\n  ],\n  [\n    [BR, __],\n  ],\n]',
      ),
    ).toEqual([
      { cells: [TILE_AIR, TILE_BRICK], at: 6 },
      { cells: [TILE_BRICK, TILE_AIR], at: 29 },
    ]);
  });

  it('should give no rows when the text is empty', () => {
    expect(parseStructureRows('')).toEqual([]);
  });
});
