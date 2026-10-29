import {
  type Bullet,
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
import { addVolleyBullet } from './add-volley-bullet';

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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.f...', '.....', '...e.', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const FIRST_BULLET = createBulletAt(10, 20);

const SECOND_BULLET = createBulletAt(50, 60);

const createVolley = (): Volley => ({
  bullets: [createBulletAt(10, 20)],
  enemies: createEnemies(LEVEL),
  fallingSpikes: createFallingSpikes(LEVEL),
  level: LEVEL,
});

describe('addVolleyBullet', () => {
  it('should put the bullet after the bullets already in flight when it adds a bullet to the volley', () => {
    const volley = createVolley();

    const result = addVolleyBullet(volley, SECOND_BULLET);

    expect(result.bullets).toEqual([FIRST_BULLET, SECOND_BULLET]);
  });

  it('should put the bullet in flight on its own when the volley has no bullets yet', () => {
    const volley = { ...createVolley(), bullets: [] };

    const result = addVolleyBullet(volley, SECOND_BULLET);

    expect(result.bullets).toEqual([SECOND_BULLET]);
  });

  it('should keep the same enemies when it adds a bullet to the volley', () => {
    const volley = createVolley();

    const result = addVolleyBullet(volley, SECOND_BULLET);

    expect(result.enemies).toBe(volley.enemies);
  });

  it('should keep the same falling spikes when it adds a bullet to the volley', () => {
    const volley = createVolley();

    const result = addVolleyBullet(volley, SECOND_BULLET);

    expect(result.fallingSpikes).toBe(volley.fallingSpikes);
  });

  it('should keep the same level when it adds a bullet to the volley', () => {
    const volley = createVolley();

    const result = addVolleyBullet(volley, SECOND_BULLET);

    expect(result.level).toBe(volley.level);
  });

  it('should leave the bullets of the given volley alone when it adds a bullet', () => {
    const volley = createVolley();
    const bullets = volley.bullets;

    addVolleyBullet(volley, SECOND_BULLET);

    expect(volley.bullets).toBe(bullets);
    expect(volley.bullets).toEqual([FIRST_BULLET]);
  });
});
