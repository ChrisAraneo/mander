import {
  type Bullet,
  type Tile,
  TILE_SIZE,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import type { GameLevel } from '../state/types/game-level';
import { computeVolley } from './compute-volley';
import { BULLET_SPEED } from './consts';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL_ROWS = [
  '........',
  '.f....f.',
  '........',
  '........',
  '...^.e..',
  '########',
];

const LEVEL = createLevel(LEVEL_ROWS);

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

const SPIKE_COLUMN = 3;
const SPIKE_ROW = 4;
const FALLING_SPIKE_COLUMN = 1;
const FALLING_SPIKE_ROW = 1;
const EMPTY_COLUMN = 3;
const EMPTY_ROW = 1;
const INSIDE_TILE = 10;
const PRONG_BAND_TOP = 20;

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('computeVolley', () => {
  it('should kill the enemy and use up the bullet when the bullet hits a living enemy', () => {
    const bullet = createBulletAt(ENEMIES[0].position.x, ENEMIES[0].position.y);

    const volley = computeVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.enemies[0].timers.death).toBe(0);
    expect(volley.enemies[0].velocity.x.current).toBe(0);
    expect(volley.bullets).toEqual([]);
  });

  it('should let the bullet fly on when the enemy it meets is already dying', () => {
    const dyingEnemy = { ...ENEMIES[0], timers: { death: 0.1, reload: 0 } };
    const bullet = createBulletAt(dyingEnemy.position.x, dyingEnemy.position.y);

    const volley = computeVolley([bullet], [dyingEnemy], FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([bullet]);
    expect(volley.enemies[0]).toBe(dyingEnemy);
  });

  it('should shatter the spike and use up the bullet when the bullet flies into its prongs', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + INSIDE_TILE,
      SPIKE_ROW * TILE_SIZE + PRONG_BAND_TOP,
    );

    const volley = computeVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.level).toEqual(SHATTERED_LEVEL);
    expect(volley.bullets).toEqual([]);
  });

  it('should leave the spike standing when the bullet passes above its prongs', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + INSIDE_TILE,
      SPIKE_ROW * TILE_SIZE,
    );

    const volley = computeVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.level).toBe(LEVEL);
    expect(volley.bullets).toEqual([bullet]);
  });

  it('should knock down the falling spike and use up the bullet when the bullet hits it', () => {
    const bullet = createBulletAt(
      FALLING_SPIKE_COLUMN * TILE_SIZE + INSIDE_TILE,
      FALLING_SPIKE_ROW * TILE_SIZE + INSIDE_TILE,
    );

    const volley = computeVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.fallingSpikes).toEqual([FALLING_SPIKES[1]]);
    expect(volley.bullets).toEqual([]);
  });

  it('should keep the bullet flying when it hits nothing', () => {
    const bullet = createBulletAt(
      EMPTY_COLUMN * TILE_SIZE + INSIDE_TILE,
      EMPTY_ROW * TILE_SIZE + INSIDE_TILE,
    );

    const volley = computeVolley([bullet], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([bullet]);
    expect(volley.enemies).toEqual(ENEMIES);
    expect(volley.fallingSpikes).toEqual(FALLING_SPIKES);
    expect(volley.level).toBe(LEVEL);
  });

  it('should not change the enemies, the spikes or the level it was given when the bullet hits', () => {
    const enemies = createEnemies(LEVEL);
    const fallingSpikes = createFallingSpikes(LEVEL);
    const bullet = createBulletAt(enemies[0].position.x, enemies[0].position.y);

    computeVolley([bullet], enemies, fallingSpikes, LEVEL);

    expect(enemies).toEqual(createEnemies(LEVEL));
    expect(fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(LEVEL).toEqual(createLevel(LEVEL_ROWS));
  });

  it('should hand back the same enemies, spikes and level when no bullet is in flight', () => {
    const volley = computeVolley([], ENEMIES, FALLING_SPIKES, LEVEL);

    expect(volley.bullets).toEqual([]);
    expect(volley.enemies).toBe(ENEMIES);
    expect(volley.fallingSpikes).toBe(FALLING_SPIKES);
    expect(volley.level).toBe(LEVEL);
  });

  it('should leave the bullets, the enemies, the falling spikes and the level it was handed untouched when the bullet hits', () => {
    const bullet = createBulletAt(ENEMIES[0].position.x, ENEMIES[0].position.y);
    const bullets = [bullet];
    const enemies = createEnemies(LEVEL);
    const fallingSpikes = createFallingSpikes(LEVEL);
    const level = createLevel(LEVEL_ROWS);

    computeVolley(bullets, enemies, fallingSpikes, level);

    expect(bullets).toEqual([bullet]);
    expect(enemies).toEqual(createEnemies(LEVEL));
    expect(fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(level).toEqual(createLevel(LEVEL_ROWS));
  });
});
