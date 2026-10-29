import {
  type Bullet,
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from '../consts';
import type { Volley } from '../types/volley';
import { patchVolleyWithBullet } from './patch-volley-with-bullet';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  e: TILE_ENEMY,
  f: TILE_SPIKE_FALLING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const createSpikeLevel = (): GameLevel =>
  createLevel(['f...f', '.....', '.^...', '#####']);

const ENEMY_LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemies(ENEMY_LEVEL)[0],
  position: { x: left, y: top },
});

const createDyingEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemyAt(left, top),
  timers: { death: 0.1, reload: 0 },
});

const createKilledEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { current: 0, max: enemy.velocity.x.max },
    y: enemy.velocity.y,
  },
  timers: { death: 0, reload: 0 },
});

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const FLYING_BULLET = createBulletAt(10, 40);

const ENEMY_BULLET = createBulletAt(100, 40);

const SPIKE_TILE_BULLET = createBulletAt(40, 80);

const MISSING_BULLET = createBulletAt(70, 40);

const createVolley = (enemies: Enemy[]): Volley => ({
  bullets: [createBulletAt(10, 40)],
  enemies,
  fallingSpikes: createFallingSpikes(createSpikeLevel()),
  level: createSpikeLevel(),
});

describe('patchVolleyWithBullet', () => {
  it('should start the death of the enemy when the bullet hits a living enemy', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, ENEMY_BULLET);

    expect(result.enemies).toEqual([createKilledEnemy(volley.enemies[0])]);
  });

  it('should use up the bullet when it hits a living enemy', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, ENEMY_BULLET);

    expect(result.bullets).toBe(volley.bullets);
  });

  it('should keep the level and the falling spikes when the bullet hits a living enemy', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, ENEMY_BULLET);

    expect(result.level).toBe(volley.level);
    expect(result.fallingSpikes).toBe(volley.fallingSpikes);
  });

  it('should keep the bullet flying when it meets only a dying enemy', () => {
    const volley = createVolley([createDyingEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, ENEMY_BULLET);

    expect(result.bullets).toEqual([FLYING_BULLET, ENEMY_BULLET]);
    expect(result.enemies).toBe(volley.enemies);
  });

  it('should keep the bullet flying when it hits nothing', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, MISSING_BULLET);

    expect(result.bullets).toEqual([FLYING_BULLET, MISSING_BULLET]);
    expect(result.enemies).toBe(volley.enemies);
  });

  it('should shatter the spike into air when the bullet misses every enemy and flies into its prongs', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);

    const result = patchVolleyWithBullet(volley, SPIKE_TILE_BULLET);

    expect(result.level.tiles).toEqual(
      createLevel(['f...f', '.....', '.....', '#####']).tiles,
    );
    expect(result.bullets).toBe(volley.bullets);
  });

  it('should leave the given volley alone when the bullet hits a living enemy', () => {
    const volley = createVolley([createEnemyAt(100, 40)]);
    const enemies = volley.enemies;
    const victim = volley.enemies[0];
    const bullets = volley.bullets;

    patchVolleyWithBullet(volley, ENEMY_BULLET);

    expect(volley.enemies).toBe(enemies);
    expect(volley.enemies[0]).toBe(victim);
    expect(victim.timers.death).toBeNull();
    expect(volley.bullets).toBe(bullets);
    expect(volley.bullets).toEqual([FLYING_BULLET]);
  });
});
