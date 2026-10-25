import { describe, expect, it } from 'vitest';

import { parseStructureTextRows } from './parse-structure-text-rows.ts';

describe('parseStructureTextRows', () => {
  it('should give the aliases of every row of both layers when the grid has rows', () => {
    expect(
      parseStructureTextRows(
        '[\n  [\n    [__, DR],\n    [BR, BR],\n  ],\n  [\n    [CN, __],\n  ],\n]',
      ),
    ).toEqual([
      ['__', 'DR'],
      ['BR', 'BR'],
      ['CN', '__'],
    ]);
  });

  it('should give no rows when the grid has none', () => {
    expect(parseStructureTextRows('[\n  [],\n  [],\n]')).toEqual([]);
  });
});
