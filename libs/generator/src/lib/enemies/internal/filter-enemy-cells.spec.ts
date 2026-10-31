import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { filterEnemyCells } from './filter-enemy-cells';

const CHANCES: EnemyChances = {
  horned: 0.5,
  fast: 0.25,
  shooter: 0.15,
  freezing: 0.15,
};

const RANDOM = createRandom('DAY-1');

const GRID: Tile[][] = [
  [TILE_ENEMY, TILE_AIR, TILE_ENEMY_FLYING],
  [TILE_BEARTRAP, TILE_ENEMY, TILE_DIRT],
];

describe('filterEnemyCells', () => {
  it('should give the spot of every enemy when the grid holds them', () => {
    expect(
      filterEnemyCells({ tiles: GRID, chances: CHANCES, random: RANDOM }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no enemy', () => {
    expect(
      filterEnemyCells({
        tiles: [[TILE_DIRT, TILE_BEARTRAP]],
        chances: CHANCES,
        random: RANDOM,
      }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      filterEnemyCells({ tiles: [], chances: CHANCES, random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for enemies', () => {
    expect(
      filterEnemyCells({ tiles: GRID, chances: CHANCES, random: RANDOM }).tiles,
    ).toBe(GRID);
  });

  it('should pass the chances on when it looks for enemies', () => {
    expect(
      filterEnemyCells({ tiles: GRID, chances: CHANCES, random: RANDOM })
        .chances,
    ).toBe(CHANCES);
  });

  it('should pass the generator on when it looks for enemies', () => {
    expect(
      filterEnemyCells({ tiles: GRID, chances: CHANCES, random: RANDOM })
        .random,
    ).toBe(RANDOM);
  });
});
