import { GRAVITY, type Player, TERMINAL_VELOCITY } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { patchDyingPlayerFall } from './patch-dying-player-fall';

const START_X = 100;

const START_Y = 200;

const HEARTS = 2;

const DELTA_SECONDS = 1 / 32;

const DEATH_SECONDS = 0.25;

const FALLING_SPEED = 160;

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

describe('patchDyingPlayerFall', () => {
  it('should let the dead player drop and speed up when a frame passes', () => {
    const patched = patchDyingPlayerFall(
      createDyingPlayer(FALLING_SPEED),
      DEATH_SECONDS,
      DELTA_SECONDS,
    );

    expect(patched.position.y).toBeCloseTo(
      START_Y + FALLING_SPEED * DELTA_SECONDS,
      PRECISION,
    );
    expect(patched.velocity.y.current).toBeCloseTo(
      FALLING_SPEED + GRAVITY * DELTA_SECONDS,
      PRECISION,
    );
  });

  it('should count the frame towards the time spent dying when a frame passes', () => {
    expect(
      patchDyingPlayerFall(
        createDyingPlayer(FALLING_SPEED),
        DEATH_SECONDS,
        DELTA_SECONDS,
      ).timers.death,
    ).toBe(DEATH_SECONDS + DELTA_SECONDS);
  });

  it('should hold the dead player at the terminal speed when they are already falling that fast', () => {
    expect(
      patchDyingPlayerFall(
        createDyingPlayer(TERMINAL_VELOCITY),
        DEATH_SECONDS,
        DELTA_SECONDS,
      ).velocity.y.current,
    ).toBe(TERMINAL_VELOCITY);
  });

  it('should leave the player it was handed untouched when a frame passes', () => {
    const player = createDyingPlayer(FALLING_SPEED);

    patchDyingPlayerFall(player, DEATH_SECONDS, DELTA_SECONDS);

    expect(player).toEqual(createDyingPlayer(FALLING_SPEED));
  });
});
