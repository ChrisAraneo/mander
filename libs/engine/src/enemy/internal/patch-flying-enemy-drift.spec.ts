import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { FLYING_ENEMY_MOVE_SPEED } from '../consts';
import { createPatrols } from './create-patrols';
import { patchFlyingEnemyDrift } from './patch-flying-enemy-drift';

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

const OPEN_LEVEL = createLevel([
  '.....',
  '..e..',
  '.....',
  '.....',
  '.....',
  '.....',
]);

const BASE_ENEMY = createPatrols(OPEN_LEVEL)[0];

const ENEMY_LEFT = 40;
const SPAWN_TOP = 100;

const createFlyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  spawn: { x: ENEMY_LEFT, y: SPAWN_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { current: velocityY, max: FLYING_ENEMY_MOVE_SPEED },
  },
});

const NEXT_TOP = 110;

describe('patchFlyingEnemyDrift', () => {
  it('should put the enemy at the new height and keep it heading down when nothing held it back', () => {
    const patched = patchFlyingEnemyDrift({
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      isClamped: false,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(patched.position.y).toBe(NEXT_TOP);
    expect(patched.velocity.y.current).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should turn the enemy round when the target was pulled into its range', () => {
    const patched = patchFlyingEnemyDrift({
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      isClamped: true,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(patched.velocity.y.current).toBe(-FLYING_ENEMY_MOVE_SPEED);
  });

  it('should turn the enemy round when a solid tile stopped it', () => {
    const patched = patchFlyingEnemyDrift({
      enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_LEFT,
      isClamped: false,
      vertical: { position: NEXT_TOP, isBlocked: true },
    });

    expect(patched.velocity.y.current).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should leave the enemy off the ground when it flies', () => {
    const patched = patchFlyingEnemyDrift({
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      isClamped: false,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(patched.statuses.isGrounded).toBe(false);
  });

  it('should leave the given enemy unchanged when it flies', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    patchFlyingEnemyDrift({
      enemy,
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      isClamped: false,
      vertical: { position: NEXT_TOP, isBlocked: false },
    });

    expect(enemy).toEqual(
      createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
    );
  });
});
