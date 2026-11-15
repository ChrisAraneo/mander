import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { computeDyingPlayerDrop } from './compute-dying-player-drop';
import type { DyingPlayerFall } from './types/dying-player-fall';

const START_X = 100;

const START_Y = 200;

const HEARTS = 2;

const DELTA_SECONDS = 1 / 32;

const DEATH_SECONDS = 0.25;

const FALLING_SPEED = 160;

const PULLED_SPEED = 200;

const PRECISION = 10;

const createDyingPlayer = (velocityY: number): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: velocityY, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: DEATH_SECONDS, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

const createFall = (velocityY: number): DyingPlayerFall => ({
  player: createDyingPlayer(FALLING_SPEED),
  death: DEATH_SECONDS,
  deltaSeconds: DELTA_SECONDS,
  velocityY,
});

describe('computeDyingPlayerDrop', () => {
  it('should move the dead player down by the speed they already had when a frame passes', () => {
    expect(
      computeDyingPlayerDrop(createFall(PULLED_SPEED)).positionY,
    ).toBeCloseTo(START_Y + FALLING_SPEED * DELTA_SECONDS, PRECISION);
  });

  it('should pass the player, the time spent dying, the frame length and the new speed on', () => {
    const fall = createFall(PULLED_SPEED);

    const drop = computeDyingPlayerDrop(fall);

    expect(drop.player).toBe(fall.player);
    expect(drop.death).toBe(DEATH_SECONDS);
    expect(drop.deltaSeconds).toBe(DELTA_SECONDS);
    expect(drop.velocityY).toBe(PULLED_SPEED);
  });

  it('should leave the fall it was handed untouched when it works out the drop', () => {
    const fall = createFall(PULLED_SPEED);

    computeDyingPlayerDrop(fall);

    expect(fall).toEqual(createFall(PULLED_SPEED));
  });
});
