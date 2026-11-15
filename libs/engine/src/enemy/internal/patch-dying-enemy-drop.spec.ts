import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { createPatrols } from './create-patrols';
import { patchDyingEnemyDrop } from './patch-dying-enemy-drop';

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

const LEVEL = createLevel(['.....', '..e..', '.....', '.....', '#####']);

const BASE_ENEMY = createPatrols(LEVEL)[0];

const ENEMY_LEFT = 40;
const AIRBORNE_TOP = 20;
const DYING_SECONDS = 0.1;
const NO_FALL_SPEED = 0;
const SLOW_FALL_SPEED = 100;

const createDyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: velocityY },
  },
  timers: { death: DYING_SECONDS, reload: 0 },
});

const NEXT_TOP = 32;

describe('patchDyingEnemyDrop', () => {
  it('should put the dying enemy at the new height and keep its fall speed when nothing blocked it', () => {
    const patched = patchDyingEnemyDrop({
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(patched.position.y).toBe(NEXT_TOP);
    expect(patched.velocity.y.current).toBe(SLOW_FALL_SPEED);
  });

  it('should stop the fall of the dying enemy when something blocked it', () => {
    const patched = patchDyingEnemyDrop({
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: NEXT_TOP, isBlocked: true },
    });

    expect(patched.velocity.y.current).toBe(NO_FALL_SPEED);
  });

  it('should keep the death clock of the dying enemy when it drops', () => {
    const patched = patchDyingEnemyDrop({
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(patched.timers.death).toBe(DYING_SECONDS);
  });

  it('should leave the given enemy unchanged when it drops', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED);

    patchDyingEnemyDrop({
      enemy,
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(enemy).toEqual(createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED));
  });
});
