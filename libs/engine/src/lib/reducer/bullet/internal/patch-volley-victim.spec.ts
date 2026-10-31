import {
  type Bullet,
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from '../consts';
import type { Volley } from '../types/volley';
import { patchVolleyVictim } from './patch-volley-victim';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..f..', '.e.e.', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const createVolley = (): Volley => ({
  bullets: [createBulletAt(10, 40)],
  enemies: createEnemies(LEVEL),
  fallingSpikes: createFallingSpikes(LEVEL),
  level: LEVEL,
});

const createKilledEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { current: 0, max: enemy.velocity.x.max },
    y: enemy.velocity.y,
  },
  timers: { death: 0, reload: 0 },
});

describe('patchVolleyVictim', () => {
  it('should start the death of the enemy when the bullet hits it', () => {
    const volley = createVolley();
    const victim = volley.enemies[0];

    const result = patchVolleyVictim(volley, victim);

    expect(result.enemies[0]).toEqual(createKilledEnemy(victim));
  });

  it('should keep every other enemy as it was when the bullet hits one enemy', () => {
    const volley = createVolley();

    const result = patchVolleyVictim(volley, volley.enemies[0]);

    expect(result.enemies[1]).toBe(volley.enemies[1]);
  });

  it('should kill no one when the enemy hit is only a copy of one in the volley', () => {
    const volley = createVolley();

    const result = patchVolleyVictim(volley, { ...volley.enemies[0] });

    expect(result.enemies[0]).toBe(volley.enemies[0]);
    expect(result.enemies[1]).toBe(volley.enemies[1]);
  });

  it('should keep the same bullets when the bullet hits an enemy', () => {
    const volley = createVolley();

    const result = patchVolleyVictim(volley, volley.enemies[0]);

    expect(result.bullets).toBe(volley.bullets);
  });

  it('should keep the same falling spikes when the bullet hits an enemy', () => {
    const volley = createVolley();

    const result = patchVolleyVictim(volley, volley.enemies[0]);

    expect(result.fallingSpikes).toBe(volley.fallingSpikes);
  });

  it('should keep the same level when the bullet hits an enemy', () => {
    const volley = createVolley();

    const result = patchVolleyVictim(volley, volley.enemies[0]);

    expect(result.level).toBe(volley.level);
  });

  it('should leave the enemies of the given volley alone when the bullet hits one', () => {
    const volley = createVolley();
    const enemies = volley.enemies;
    const victim = volley.enemies[0];

    patchVolleyVictim(volley, victim);

    expect(volley.enemies).toBe(enemies);
    expect(volley.enemies[0]).toBe(victim);
    expect(victim.timers.death).toBeNull();
  });
});
