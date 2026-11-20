import { createRandom } from '@mander/common';
import {
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  type Tile,
} from '@mander/model';
import { map, size, times, toString, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Cell } from '../../types/cell';
import type { EnemyChances } from '../../types/enemy-chances';
import { createEnemyPatches } from './create-enemy-patches';

const CHANCES: EnemyChances = { horned: 0, fast: 0, shooter: 0, freezing: 0 };

const MIXED: EnemyChances = {
  horned: 0.5,
  fast: 0.5,
  shooter: 0.5,
  freezing: 0.5,
};

const GRID: Tile[][] = [
  [TILE_ENEMY, TILE_ENEMY],
  [TILE_DIRT, TILE_AIR],
];

const BOTH_SPAWNS: Cell[] = [
  { row: 0, column: 0 },
  { row: 0, column: 1 },
];

const SEEDS_TRIED = 40;

const SEEDS = times(SEEDS_TRIED, (day) => `DAY-${day}`);

const createPatchesIn = (
  tiles: Tile[][],
  cells: Cell[] = [{ row: 0, column: 0 }],
  chances: EnemyChances = CHANCES,
  seed = 'DAY-1',
) =>
  createEnemyPatches({
    tiles,
    chances,
    cells,
    random: createRandom(seed),
  });

const formatTiles = (chances: EnemyChances, seed: string): string =>
  toString(
    map(
      createPatchesIn(GRID, BOTH_SPAWNS, chances, seed).patches,
      (patch) => patch.tile,
    ),
  );

describe('createEnemyPatches', () => {
  it('should name the tile each spawn is owed when the grid holds several', () => {
    expect(createPatchesIn(GRID, BOTH_SPAWNS).patches).toEqual([
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

  it('should name the same tiles when the generator starts from the same seed', () => {
    expect(formatTiles(MIXED, 'DAY-1')).toEqual(formatTiles(MIXED, 'DAY-1'));
  });

  it('should name other tiles when the generator starts from other seeds', () => {
    expect(
      size(uniq(map(SEEDS, (seed) => formatTiles(MIXED, seed)))),
    ).toBeGreaterThan(1);
  });
});
