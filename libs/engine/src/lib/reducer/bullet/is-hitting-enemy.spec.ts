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

import type { GameLevel } from '../../types/game-level';
import { createEnemies } from '../enemy/create-enemies';
import { BULLET_SPEED } from './consts';
import { isHittingEnemy } from './is-hitting-enemy';

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

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('isHittingEnemy', () => {
  it('should say yes when the bullet flies into the enemy', () => {
    const bullet = createBulletAt(100, 100);
    const enemy = createEnemyAt(100, 100);

    const isHit = isHittingEnemy(bullet, enemy);

    expect(isHit).toBe(true);
  });

  it('should say yes when the bullet just reaches past the edge of the enemy', () => {
    const bullet = createBulletAt(100, 100);
    const enemy = createEnemyAt(105, 100);

    const isHit = isHittingEnemy(bullet, enemy);

    expect(isHit).toBe(true);
  });

  it('should say no when the bullet is far from the enemy', () => {
    const bullet = createBulletAt(100, 100);
    const enemy = createEnemyAt(300, 300);

    const isHit = isHittingEnemy(bullet, enemy);

    expect(isHit).toBe(false);
  });

  it('should say no when the bullet only touches the side of the enemy', () => {
    const bullet = createBulletAt(100, 100);
    const enemy = createEnemyAt(106, 100);

    const isHit = isHittingEnemy(bullet, enemy);

    expect(isHit).toBe(false);
  });

  it('should say no when the bullet only touches the top of the enemy', () => {
    const bullet = createBulletAt(100, 100);
    const enemy = createEnemyAt(100, 106);

    const isHit = isHittingEnemy(bullet, enemy);

    expect(isHit).toBe(false);
  });
});
