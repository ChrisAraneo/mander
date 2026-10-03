import { TILE_AIR, TILE_DIRT, TILE_FIREBALL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findFireballCells } from './find-fireball-cells';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_FIREBALL],
  [TILE_FIREBALL, TILE_DIRT],
];

describe('findFireballCells', () => {
  it('should give the spot of every fireball when they are out', () => {
    expect(findFireballCells({ tiles: LEVEL, lit: false }).cells).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
    ]);
  });

  it('should give no spots when the fireballs are lit', () => {
    expect(findFireballCells({ tiles: LEVEL, lit: true }).cells).toEqual([]);
  });

  it('should give no spots when the grid holds no fireball', () => {
    expect(
      findFireballCells({ tiles: [[TILE_DIRT]], lit: false }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(findFireballCells({ tiles: [], lit: false }).cells).toEqual([]);
  });

  it('should keep the grid the same when it looks for fireballs', () => {
    expect(findFireballCells({ tiles: LEVEL, lit: false }).tiles).toBe(LEVEL);
  });
});
