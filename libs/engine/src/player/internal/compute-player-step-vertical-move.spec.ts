import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerStepVerticalMove } from './compute-player-step-vertical-move';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '.#....', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createAirbornePlayer = (positionY: number): Player => ({
  position: { x: 100, y: positionY },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: false, isGrounded: false, isJumpQueued: false },
});

const LEVEL = createLevel();

const OPEN_AIR_PLAYER = createAirbornePlayer(10);

const createHorizontalMoveStep = (
  player: Player,
  nextX: number,
  velocityY: number,
  isGrounded: boolean,
): PlayerStepHorizontalMove => ({
  level: LEVEL,
  player,
  deltaSeconds: 0.04,
  isFacingRight: false,
  velocityY,
  isGrounded,
  nextX,
  blockedVelocityX: 150,
});

const OPEN_AIR_STEP = createHorizontalMoveStep(OPEN_AIR_PLAYER, 100, 200, true);

describe('computePlayerStepVerticalMove', () => {
  it('should move the player the whole way down and take them off the ground when they fall through open air', () => {
    const step = computePlayerStepVerticalMove(OPEN_AIR_STEP);

    expect(step.nextY).toBeCloseTo(10 + 200 * 0.04, 6);
    expect(step.nextY).toBeCloseTo(18, 6);
    expect(step.velocityY).toBe(200);
    expect(step.isGrounded).toBe(false);
  });

  it('should stand the player on top of the floor and stop their fall when they fall onto a solid tile', () => {
    const step = computePlayerStepVerticalMove(
      createHorizontalMoveStep(createAirbornePlayer(78), 100, 200, false),
    );

    expect(step.nextY).toBe(80);
    expect(step.velocityY).toBe(0);
    expect(step.isGrounded).toBe(true);
  });

  it('should stop the player flush below the ceiling and keep their grounded status when they rise into a solid tile', () => {
    const step = computePlayerStepVerticalMove(
      createHorizontalMoveStep(createAirbornePlayer(66), 40, -200, true),
    );

    expect(step.nextY).toBe(64);
    expect(step.velocityY).toBe(0);
    expect(step.isGrounded).toBe(true);
  });

  it('should pass the player on unchanged when it moves the player up or down', () => {
    const step = computePlayerStepVerticalMove(OPEN_AIR_STEP);

    expect(step.player).toBe(OPEN_AIR_PLAYER);
  });

  it('should pass the facing on unchanged when it moves the player up or down', () => {
    const step = computePlayerStepVerticalMove(OPEN_AIR_STEP);

    expect(step.isFacingRight).toBe(false);
  });

  it('should pass the next horizontal position on unchanged when it moves the player up or down', () => {
    const step = computePlayerStepVerticalMove(OPEN_AIR_STEP);

    expect(step.nextX).toBe(100);
  });

  it('should pass the blocked horizontal velocity on unchanged when it moves the player up or down', () => {
    const step = computePlayerStepVerticalMove(OPEN_AIR_STEP);

    expect(step.blockedVelocityX).toBe(150);
  });
});
