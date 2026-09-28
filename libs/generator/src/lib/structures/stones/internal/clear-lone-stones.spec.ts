import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Field } from './field';
import { clearLoneStones } from './clear-lone-stones';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const clear = (cells: Field) => clearLoneStones({ tiles: LEVEL, cells }).cells;

describe('clearLoneStones', () => {
  it('should drop a stone that has no stone next to it', () => {
    expect(
      clear([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('should keep stones that each have two stones next to them', () => {
    expect(
      clear([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('should drop a stone that is left alone after the first round', () => {
    expect(clear([[1, 1, 1]])).toEqual([[0, 0, 0]]);
  });

  it('should not count stones that only touch at a corner', () => {
    expect(
      clear([
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
      ]),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('should keep the grid the same when it drops stones', () => {
    expect(clearLoneStones({ tiles: LEVEL, cells: [[0]] }).tiles).toBe(LEVEL);
  });
});
