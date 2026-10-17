import {
  type Enemy,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { computeEnemyStepHop } from './compute-enemy-step-hop';
import type { EnemyStepDelta } from './types/enemy-step-delta';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createStandingEnemy = (isFacingRight: boolean): Enemy => ({
  kind: 'HOPPING',
  position: { x: 80, y: 74 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 12, max: 430 } },
  timers: { death: null },
  spawn: { x: 80, y: 74 },
  statuses: { isFacingRight, isGrounded: true },
});

const createPlayerAt = (left: number, top: number): Player => ({
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const LEVEL = createLevel();

const RIGHT_ENEMY = createStandingEnemy(true);

const LEFT_ENEMY = createStandingEnemy(false);

const OVERHEAD_PLAYER = createPlayerAt(80, 16);

const DISTANT_PLAYER = createPlayerAt(300, 74);

const createDeltaStep = (enemy: Enemy, player: Player): EnemyStepDelta => ({
  level: LEVEL,
  enemy,
  player,
  deltaSeconds: 0.02,
});

const DISTANT_STEP = createDeltaStep(RIGHT_ENEMY, DISTANT_PLAYER);

describe('computeEnemyStepHop', () => {
  it('should face the enemy right when the enemy faces right', () => {
    const step = computeEnemyStepHop(DISTANT_STEP);

    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should face the enemy left when the enemy faces left', () => {
    const step = computeEnemyStepHop(
      createDeltaStep(LEFT_ENEMY, DISTANT_PLAYER),
    );

    expect(step.facing).toBe(FACING_LEFT);
  });

  it('should make the enemy jump off the ground when it stands on the ground and the player is overhead', () => {
    const step = computeEnemyStepHop(
      createDeltaStep(RIGHT_ENEMY, OVERHEAD_PLAYER),
    );

    expect(step.velocityY).toBe(-430);
    expect(step.isGrounded).toBe(false);
  });

  it('should keep the enemy speed and footing when the player is not overhead', () => {
    const step = computeEnemyStepHop(DISTANT_STEP);

    expect(step.velocityY).toBe(12);
    expect(step.isGrounded).toBe(true);
  });

  it('should pass the level on unchanged when it decides on the hop', () => {
    const step = computeEnemyStepHop(DISTANT_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when it decides on the hop', () => {
    const step = computeEnemyStepHop(DISTANT_STEP);

    expect(step.enemy).toBe(RIGHT_ENEMY);
  });

  it('should pass the tick length on unchanged when it decides on the hop', () => {
    const step = computeEnemyStepHop(DISTANT_STEP);

    expect(step.deltaSeconds).toBe(0.02);
  });
});
