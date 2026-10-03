import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { findBeartrapCells } from './find-beartrap-cells';

const LEVEL: Tile[][] = [
  [TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
  [TILE_SPIKE, TILE_BEARTRAP, TILE_DIRT],
];

const RANDOM = createRandom('SEED');

describe('findBeartrapCells', () => {
  it('should give the spot of every trap when the grid holds them', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).cells,
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
        random: RANDOM,
        rate: 1,
      }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      findBeartrapCells({ tiles: [], random: RANDOM, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for traps', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the generator on when it looks for traps', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).random,
    ).toBe(RANDOM);
  });

  it('should pass the rate on when it looks for traps', () => {
    expect(
      findBeartrapCells({ tiles: LEVEL, random: RANDOM, rate: 0.35 }).rate,
    ).toBe(0.35);
  });
});
