import { GRAVITY } from '@mander/model';
import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { COLD_JUMP_HEIGHT_FACTOR, PLAYER_MAX_JUMP_VELOCITY } from './consts';
import { getPlayerJumpVelocity } from './get-player-jump-velocity';

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const computeJumpHeight = (velocity: number): number =>
  (velocity * velocity) / (2 * GRAVITY);

describe('getPlayerJumpVelocity', () => {
  it('should give the whole jump push when the player is warm', () => {
    expect(getPlayerJumpVelocity(createPlayerWithCold(0))).toBe(
      PLAYER_MAX_JUMP_VELOCITY,
    );
  });

  it('should give a jump push that reaches half the usual height when the player is cold', () => {
    const cold = getPlayerJumpVelocity(createPlayerWithCold(2));

    expect(computeJumpHeight(cold)).toBeCloseTo(
      computeJumpHeight(PLAYER_MAX_JUMP_VELOCITY) * COLD_JUMP_HEIGHT_FACTOR,
      6,
    );
  });

  it('should leave the given player alone when it reads the jump push', () => {
    const player = createPlayerWithCold(2);

    getPlayerJumpVelocity(player);

    expect(player).toEqual(createPlayerWithCold(2));
  });
});
