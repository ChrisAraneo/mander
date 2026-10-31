import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../create-enemies';
import { computeEnemyHeadBeforeHop } from './compute-enemy-head-before-hop';

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

const BASE_ENEMY = createEnemies(LEVEL)[0];

const createEnemyMoving = (velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: 100, y: 40 },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: velocityY },
  },
});

describe('computeEnemyHeadBeforeHop', () => {
  it('should put the head back where it was before the tick when the enemy is rising', () => {
    const enemy = createEnemyMoving(-200);

    const headY = computeEnemyHeadBeforeHop(enemy, 0.02);

    expect(headY).toBeCloseTo(47, 6);
  });

  it('should rewind the head by at most one longest tick when the enemy is rising through a long frame', () => {
    const enemy = createEnemyMoving(-200);

    const headY = computeEnemyHeadBeforeHop(enemy, 0.1);

    expect(headY).toBeCloseTo(51, 6);
  });

  it('should leave the head where it is when the enemy is falling', () => {
    const enemy = createEnemyMoving(150);

    const headY = computeEnemyHeadBeforeHop(enemy, 0.02);

    expect(headY).toBe(43);
  });

  it('should leave the head where it is when the enemy is still', () => {
    const enemy = createEnemyMoving(0);

    const headY = computeEnemyHeadBeforeHop(enemy, 0.02);

    expect(headY).toBe(43);
  });
});
