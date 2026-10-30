import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { createEnemyPatches } from './create-enemy-patches';

const CHANCES: EnemyChances = { horned: 0, fast: 0, shooter: 0 };

const GRID: Tile[][] = [
  [TILE_ENEMY, TILE_ENEMY],
  [TILE_DIRT, TILE_AIR],
];

const createPatchesIn = (tiles: Tile[][], cells = [{ row: 0, column: 0 }]) =>
  createEnemyPatches({
    tiles,
    chances: CHANCES,
    cells,
    random: createRandom('DAY-1'),
  });

describe('createEnemyPatches', () => {
  it('should name the tile each spawn is owed when the grid holds several', () => {
    expect(
      createPatchesIn(GRID, [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
      ]).patches,
    ).toEqual([
      { row: 0, column: 0, tile: TILE_ENEMY_HOPPING },
      { row: 0, column: 1, tile: TILE_ENEMY_FLYING },
    ]);
  });

  it('should name no tiles when the grid holds no spawn', () => {
    expect(createPatchesIn(GRID, []).patches).toEqual([]);
  });

  it('should keep the grid the same when it names the tiles', () => {
    expect(createPatchesIn(GRID).tiles).toBe(GRID);
  });
});
