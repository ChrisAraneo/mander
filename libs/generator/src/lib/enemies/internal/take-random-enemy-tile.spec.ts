import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { takeRandomEnemyTile } from './take-random-enemy-tile';

const NOTHING: EnemyChances = { horned: 0, fast: 0, shooter: 0 };

const GROUNDED: Tile[][] = [[TILE_ENEMY], [TILE_DIRT]];

const AIRBORNE: Tile[][] = [[TILE_ENEMY], [TILE_AIR], [TILE_DIRT]];

const takeTile = (tiles: Tile[][], chances: EnemyChances = NOTHING): Tile =>
  takeRandomEnemyTile(
    tiles,
    { row: 0, column: 0 },
    chances,
    createRandom('DAY-1'),
  );

describe('takeRandomEnemyTile', () => {
  it('should draw a walking enemy when the spawn stands on solid ground', () => {
    expect(takeTile(GROUNDED)).toBe(TILE_ENEMY_HOPPING);
  });

  it('should draw the enemy the level rolled when the spawn stands on solid ground', () => {
    expect(takeTile(GROUNDED, { horned: 1, fast: 1, shooter: 1 })).toBe(
      TILE_ENEMY_SHOOTER,
    );
  });

  it('should send a flier up when the spawn hangs over air', () => {
    expect(takeTile(AIRBORNE)).toBe(TILE_ENEMY_FLYING);
  });

  it('should send a flier up when a walking enemy was left hanging over air', () => {
    expect(takeTile([[TILE_ENEMY_SHOOTER], [TILE_AIR], [TILE_DIRT]])).toBe(
      TILE_ENEMY_FLYING,
    );
  });

  it('should leave the enemy alone when the tile already names one that walks', () => {
    expect(takeTile([[TILE_ENEMY_SHOOTER], [TILE_DIRT]])).toBe(
      TILE_ENEMY_SHOOTER,
    );
  });

  it('should draw a walking enemy when a flier was left standing on solid ground', () => {
    expect(takeTile([[TILE_ENEMY_FLYING], [TILE_DIRT]])).toBe(
      TILE_ENEMY_HOPPING,
    );
  });
});
