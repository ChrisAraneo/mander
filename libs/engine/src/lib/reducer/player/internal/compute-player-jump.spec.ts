import { type Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { PLAYER_MAX_JUMP_VELOCITY } from '../consts';
import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerJump } from './compute-player-jump';

const NO_INPUT: InputState = { isLeft: false, isRight: false, isJump: false };

const JUMP_INPUT: InputState = { isLeft: false, isRight: false, isJump: true };

const createStandingPlayer = (isJumpQueued: boolean): Player => ({
  position: { x: 32, y: 112 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued },
});

const PLAYER = createStandingPlayer(false);

const QUEUED_PLAYER = createStandingPlayer(true);

const GROUNDED = { velocityY: 0, isGrounded: true };

const AIRBORNE = { velocityY: 50, isGrounded: false };

describe('computePlayerJump', () => {
  it('should launch the player upwards when they press jump on the ground', () => {
    const jump = computePlayerJump(GROUNDED, JUMP_INPUT, PLAYER);

    expect(jump).toEqual({
      velocityY: -PLAYER_MAX_JUMP_VELOCITY,
      isGrounded: false,
    });
  });

  it('should launch the player upwards when a jump is queued on the ground', () => {
    const jump = computePlayerJump(GROUNDED, NO_INPUT, QUEUED_PLAYER);

    expect(jump).toEqual({
      velocityY: -PLAYER_MAX_JUMP_VELOCITY,
      isGrounded: false,
    });
  });

  it('should leave the motion alone when the player stands without jumping', () => {
    const jump = computePlayerJump(GROUNDED, NO_INPUT, PLAYER);

    expect(jump).toBe(GROUNDED);
  });

  it('should leave the motion alone when the player presses jump in the air', () => {
    const jump = computePlayerJump(AIRBORNE, JUMP_INPUT, QUEUED_PLAYER);

    expect(jump).toBe(AIRBORNE);
  });
});
