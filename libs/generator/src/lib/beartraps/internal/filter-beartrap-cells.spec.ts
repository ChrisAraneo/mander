import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { filterBeartrapCells } from './filter-beartrap-cells';

const LEVEL: Tile[][] = [
  [TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
  [TILE_SPIKE, TILE_BEARTRAP, TILE_DIRT],
];

const RANDOM = createRandom('SEED');

describe('filterBeartrapCells', () => {
  it('should give the spot of every trap when the grid holds them', () => {
    expect(
      filterBeartrapCells({ tiles: LEVEL, rate: 1, random: RANDOM }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no trap', () => {
    expect(
      filterBeartrapCells({
        tiles: [[TILE_DIRT, TILE_SPIKE]],
        rate: 1,
        random: RANDOM,
      }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      filterBeartrapCells({ tiles: [], rate: 1, random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for traps', () => {
    expect(
      filterBeartrapCells({ tiles: LEVEL, rate: 1, random: RANDOM }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the generator on when it looks for traps', () => {
    expect(
      filterBeartrapCells({ tiles: LEVEL, rate: 1, random: RANDOM }).random,
    ).toBe(RANDOM);
  });

  it('should pass the rate on when it looks for traps', () => {
    expect(
      filterBeartrapCells({ tiles: LEVEL, rate: 0.35, random: RANDOM }).rate,
    ).toBe(0.35);
  });
});
