import { GRAVITY, type Player, TERMINAL_VELOCITY } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { computeDyingPlayerFall } from './compute-dying-player-fall';

const START_X = 100;

const START_Y = 200;

const HEARTS = 2;

const DELTA_SECONDS = 1 / 32;

const DEATH_SECONDS = 0.25;

const RISING_SPEED = -100;

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

describe('computeDyingPlayerFall', () => {
  it('should pull the dead player further down when a frame passes', () => {
    expect(
      computeDyingPlayerFall({
        player: createDyingPlayer(RISING_SPEED),
        death: DEATH_SECONDS,
        deltaSeconds: DELTA_SECONDS,
      }).velocityY,
    ).toBeCloseTo(RISING_SPEED + GRAVITY * DELTA_SECONDS, PRECISION);
  });

  it('should not let the dead player fall faster than the terminal speed when they have been falling a while', () => {
    expect(
      computeDyingPlayerFall({
        player: createDyingPlayer(TERMINAL_VELOCITY),
        death: DEATH_SECONDS,
        deltaSeconds: DELTA_SECONDS,
      }).velocityY,
    ).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the player, the time spent dying and the frame length on', () => {
    const player = createDyingPlayer(RISING_SPEED);

    const fall = computeDyingPlayerFall({
      player,
      death: DEATH_SECONDS,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(fall.player).toBe(player);
    expect(fall.death).toBe(DEATH_SECONDS);
    expect(fall.deltaSeconds).toBe(DELTA_SECONDS);
  });

  it('should leave the player it was handed untouched when it works out the fall', () => {
    const player = createDyingPlayer(RISING_SPEED);

    computeDyingPlayerFall({
      player,
      death: DEATH_SECONDS,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(player).toEqual(createDyingPlayer(RISING_SPEED));
  });
});
