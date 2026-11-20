import { createRandom } from '@mander/common';
import {
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { takeRandomEnemyTile } from './take-random-enemy-tile';

const NOTHING: EnemyChances = { horned: 0, fast: 0, shooter: 0, freezing: 0 };

const GROUNDED: Tile[][] = [[TILE_ENEMY], [TILE_DIRT]];

const AIRBORNE: Tile[][] = [[TILE_ENEMY], [TILE_AIR], [TILE_DIRT]];

const MIXED: EnemyChances = {
  horned: 0.5,
  fast: 0.5,
  shooter: 0.5,
  freezing: 0.5,
};

const SEEDS_TRIED = 40;

const SEEDS = times(SEEDS_TRIED, (day) => `DAY-${day}`);

const takeRandomTile = (
  tiles: Tile[][],
  chances: EnemyChances = NOTHING,
  seed = 'DAY-1',
): Tile =>
  takeRandomEnemyTile(
    tiles,
    { row: 0, column: 0 },
    chances,
    createRandom(seed),
  );

describe('takeRandomEnemyTile', () => {
  it('should draw a walking enemy when the spawn stands on solid ground', () => {
    expect(takeRandomTile(GROUNDED)).toBe(TILE_ENEMY_HOPPING);
  });

  it('should draw the enemy the level rolled when the spawn stands on solid ground', () => {
    expect(
      takeRandomTile(GROUNDED, { horned: 1, fast: 1, shooter: 1, freezing: 1 }),
    ).toBe(TILE_ENEMY_SHOOTER);
  });

  it('should send a flier up when the spawn hangs over air', () => {
    expect(takeRandomTile(AIRBORNE)).toBe(TILE_ENEMY_FLYING);
  });

  it('should send a flier up when a walking enemy was left hanging over air', () => {
    expect(
      takeRandomTile([[TILE_ENEMY_SHOOTER], [TILE_AIR], [TILE_DIRT]]),
    ).toBe(TILE_ENEMY_FLYING);
  });

  it('should leave the enemy alone when the tile already names one that walks', () => {
    expect(takeRandomTile([[TILE_ENEMY_SHOOTER], [TILE_DIRT]])).toBe(
      TILE_ENEMY_SHOOTER,
    );
  });

  it('should draw a walking enemy when a flier was left standing on solid ground', () => {
    expect(takeRandomTile([[TILE_ENEMY_FLYING], [TILE_DIRT]])).toBe(
      TILE_ENEMY_HOPPING,
    );
  });

  it('should draw the same enemy when the generator starts from the same seed', () => {
    expect(takeRandomTile(GROUNDED, MIXED)).toBe(
      takeRandomTile(GROUNDED, MIXED),
    );
  });

  it('should draw other enemies when the generator starts from other seeds', () => {
    expect(
      size(uniq(map(SEEDS, (seed) => takeRandomTile(GROUNDED, MIXED, seed)))),
    ).toBeGreaterThan(1);
  });
});
