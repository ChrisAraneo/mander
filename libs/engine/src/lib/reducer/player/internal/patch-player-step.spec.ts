import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { patchPlayerStep } from './patch-player-step';
import type { PlayerStepVerticalMove } from './types/player-step-vertical-move';

const createJumpingPlayer = (): Player => ({
  position: { x: 32, y: 64 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 1, star: 0.5, hurt: 0.2 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: true },
});

const createVerticalMoveStep = (player: Player): PlayerStepVerticalMove => ({
  player,
  isFacingRight: false,
  nextX: 40,
  blockedVelocityX: -120,
  nextY: 80,
  velocityY: 0,
  isGrounded: true,
});

const PLAYER = createJumpingPlayer();

const STEP = createVerticalMoveStep(PLAYER);

describe('patchPlayerStep', () => {
  it('should place the player at the next position with the new speeds and keep both top speeds when it finishes the step', () => {
    const patched = patchPlayerStep(STEP);

    expect(patched.position).toEqual({ x: 40, y: 80 });
    expect(patched.velocity).toEqual({
      x: { current: -120, max: PLAYER_MAX_MOVE_VELOCITY },
      y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
    });
  });

  it('should take the facing and the grounded status from the step and clear the queued jump when it finishes the step', () => {
    const patched = patchPlayerStep(STEP);

    expect(patched.statuses).toEqual({
      isFacingRight: false,
      isGrounded: true,
      isJumpQueued: false,
    });
  });

  it('should keep the same hearts and timers when it finishes the step', () => {
    const patched = patchPlayerStep(STEP);

    expect(patched.hearts).toBe(PLAYER.hearts);
    expect(patched.timers).toBe(PLAYER.timers);
  });

  it('should leave the given player unchanged when it finishes the step', () => {
    const player = createJumpingPlayer();

    patchPlayerStep(createVerticalMoveStep(player));

    expect(player).toEqual(createJumpingPlayer());
  });
});
