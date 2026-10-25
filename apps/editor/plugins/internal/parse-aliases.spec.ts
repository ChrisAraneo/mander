import { describe, expect, it } from 'vitest';

import { parseAliases } from './parse-aliases.ts';

describe('parseAliases', () => {
  it('should give each alias once in the order it first comes when the grid uses some twice', () => {
    expect(
      parseAliases(
        '[\n  [\n    [__, DR, __],\n    [BR, DR, BR],\n  ],\n  [],\n]',
      ),
    ).toEqual(['__', 'DR', 'BR']);
  });

  it('should give no aliases when the grid has no cells', () => {
    expect(parseAliases('[\n  [],\n  [],\n]')).toEqual([]);
  });
});
