import { createRandom, type Random } from '@mander/common';
import { type Tile, TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterTripleCannonCells } from './filter-triple-cannon-cells';

const RANDOM: Random = createRandom('DAY-1');

const WITH_CANNONS: Tile[][] = [
  [TILE_CANNON, TILE_AIR],
  [TILE_DIRT, TILE_CANNON],
];

const WITHOUT_CANNONS: Tile[][] = [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

describe('filterTripleCannonCells', () => {
  it('should find every cannon of the level when the level holds some', () => {
    expect(
      filterTripleCannonCells({ tiles: WITH_CANNONS, random: RANDOM }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ]);
  });

  it('should find no cannon when the level holds none', () => {
    expect(
      filterTripleCannonCells({ tiles: WITHOUT_CANNONS, random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should find no cannon when the level is empty', () => {
    expect(
      filterTripleCannonCells({ tiles: [], random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should pass the level on when it finds the cannons', () => {
    expect(
      filterTripleCannonCells({ tiles: WITH_CANNONS, random: RANDOM }).tiles,
    ).toBe(WITH_CANNONS);
  });

  it('should pass the generator on when it finds the cannons', () => {
    expect(
      filterTripleCannonCells({ tiles: WITH_CANNONS, random: RANDOM }).random,
    ).toBe(RANDOM);
  });
});
