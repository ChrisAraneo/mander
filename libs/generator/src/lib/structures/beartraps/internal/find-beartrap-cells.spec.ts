import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findBeartrapCells } from './find-beartrap-cells';

const LEVEL: Tile[][] = [
  [TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
  [TILE_SPIKE, TILE_BEARTRAP, TILE_DIRT],
];

describe('findBeartrapCells', () => {
  it('should give the spot of every trap when the grid holds them', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, levelNumber: 1, rate: 1 }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no trap', () => {
    expect(
      findBeartrapCells({
        tiles: [[TILE_DIRT, TILE_SPIKE]],
        levelNumber: 1,
        rate: 1,
      }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      findBeartrapCells({ tiles: [], levelNumber: 1, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for traps', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, levelNumber: 1, rate: 1 }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the level number and rate on when it looks for traps', () => {
    const found = findBeartrapCells({
      tiles: LEVEL,
      levelNumber: 2,
      rate: 0.35,
    });

    expect([found.levelNumber, found.rate]).toEqual([2, 0.35]);
  });
});
