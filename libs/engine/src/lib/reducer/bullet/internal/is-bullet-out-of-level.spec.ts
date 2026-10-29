import {
  type Bullet,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BULLET_SIZE, BULLET_SPEED } from '../consts';
import { isBulletOutOfLevel } from './is-bullet-out-of-level';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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
});

const LEVEL = createLevel(['.....', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('isBulletOutOfLevel', () => {
  it('should say yes when the whole bullet has flown off the left edge of the level', () => {
    const bullet = createBulletAt(-BULLET_SIZE - 1, 0);

    const isOut = isBulletOutOfLevel(LEVEL, bullet);

    expect(isOut).toBe(true);
  });

  it('should say yes when the bullet has flown past the right edge of the level', () => {
    const bullet = createBulletAt(5 * TILE_SIZE + 1, 0);

    const isOut = isBulletOutOfLevel(LEVEL, bullet);

    expect(isOut).toBe(true);
  });

  it('should say no when the bullet is inside the level', () => {
    const bullet = createBulletAt(50, 0);

    const isOut = isBulletOutOfLevel(LEVEL, bullet);

    expect(isOut).toBe(false);
  });

  it('should say no when the bullet sits exactly on the right edge of the level', () => {
    const bullet = createBulletAt(5 * TILE_SIZE, 0);

    const isOut = isBulletOutOfLevel(LEVEL, bullet);

    expect(isOut).toBe(false);
  });

  it('should say no when the bullet has only just left the left edge of the level', () => {
    const bullet = createBulletAt(-BULLET_SIZE, 0);

    const isOut = isBulletOutOfLevel(LEVEL, bullet);

    expect(isOut).toBe(false);
  });
});
