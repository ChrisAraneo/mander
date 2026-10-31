import {
  type Bullet,
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { BULLET_SPEED } from '../consts';
import { findBulletVictim } from './find-bullet-victim';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
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

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position: { x: left, y: top },
});

const createDyingEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemyAt(left, top),
  timers: { death: 0.1, reload: 0 },
});

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const BULLET = createBulletAt(100, 100);

describe('findBulletVictim', () => {
  it('should pick the first enemy in the list when the bullet hits two enemies at once', () => {
    const farEnemy = createEnemyAt(300, 300);
    const firstEnemy = createEnemyAt(100, 100);
    const secondEnemy = createEnemyAt(102, 100);

    const victim = findBulletVictim(BULLET, [
      farEnemy,
      firstEnemy,
      secondEnemy,
    ]);

    expect(victim).toBe(firstEnemy);
  });

  it('should pass over a dying enemy when the bullet flies through it into a living one', () => {
    const dyingEnemy = createDyingEnemyAt(100, 100);
    const livingEnemy = createEnemyAt(102, 100);

    const victim = findBulletVictim(BULLET, [dyingEnemy, livingEnemy]);

    expect(victim).toBe(livingEnemy);
  });

  it('should find no one when the only enemy the bullet meets is dying', () => {
    const dyingEnemy = createDyingEnemyAt(100, 100);

    const victim = findBulletVictim(BULLET, [dyingEnemy]);

    expect(victim).toBeUndefined();
  });

  it('should find no one when the bullet misses every enemy', () => {
    const enemies = [createEnemyAt(300, 300), createEnemyAt(0, 0)];

    const victim = findBulletVictim(BULLET, enemies);

    expect(victim).toBeUndefined();
  });

  it('should find no one when there are no enemies', () => {
    const victim = findBulletVictim(BULLET, []);

    expect(victim).toBeUndefined();
  });
});
