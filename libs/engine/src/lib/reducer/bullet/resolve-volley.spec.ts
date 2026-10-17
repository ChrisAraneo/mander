import {
  type Bullet,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from './consts';
import { resolveVolley } from './resolve-volley';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  '^': TILE_SPIKE,
  f: TILE_SPIKE_FALLING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel([
  '........',
  '.f....f.',
  '........',
  '........',
  '...^.e..',
  '########',
]);

const SHATTERED_LEVEL = createLevel([
  '........',
  '.f....f.',
  '........',
  '........',
  '.....e..',
  '########',
]);

const ENEMIES = createEnemies(LEVEL);

const FALLING_SPIKES = createFallingSpikes(LEVEL);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('resolveVolley', () => {
  it('should kill the enemy and use up the bullet when the bullet hits a living enemy', () => {
    const bullet = createBulletAt(ENEMIES[0].position.x, ENEMIES[0].position.y);

    const volley = resolveVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.enemies[0].timers.death).toBe(0);
    expect(volley.enemies[0].velocity.x.current).toBe(0);
    expect(volley.bullets).toEqual([]);
  });

  it('should let the bullet fly on when the enemy it meets is already dying', () => {
    const dyingEnemy = { ...ENEMIES[0], timers: { death: 0.1 } };
    const bullet = createBulletAt(dyingEnemy.position.x, dyingEnemy.position.y);

    const volley = resolveVolley([bullet], [dyingEnemy], FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([bullet]);
    expect(volley.enemies[0]).toBe(dyingEnemy);
  });

  it('should shatter the spike and use up the bullet when the bullet flies into its prongs', () => {
    const bullet = createBulletAt(106, 148);

    const volley = resolveVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.level).toEqual(SHATTERED_LEVEL);
    expect(volley.bullets).toEqual([]);
  });

  it('should leave the spike standing when the bullet passes above its prongs', () => {
    const bullet = createBulletAt(106, 128);

    const volley = resolveVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.level).toBe(LEVEL);
    expect(volley.bullets).toEqual([bullet]);
  });

  it('should knock down the falling spike and use up the bullet when the bullet hits it', () => {
    const bullet = createBulletAt(40, 37);

    const volley = resolveVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.fallingSpikes).toEqual([FALLING_SPIKES[1]]);
    expect(volley.bullets).toEqual([]);
  });

  it('should keep the bullet flying when it hits nothing', () => {
    const bullet = createBulletAt(100, 40);

    const volley = resolveVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([bullet]);
    expect(volley.enemies).toEqual(ENEMIES);
    expect(volley.fallingSpikes).toEqual(FALLING_SPIKES);
    expect(volley.level).toBe(LEVEL);
  });

  it('should hand back the same enemies, spikes and level when no bullet is in flight', () => {
    const volley = resolveVolley([], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([]);
    expect(volley.enemies).toBe(ENEMIES);
    expect(volley.fallingSpikes).toBe(FALLING_SPIKES);
    expect(volley.level).toBe(LEVEL);
  });
});
