import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { COLD_MOVE_FACTOR, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { getPlayerMoveVelocity } from './get-player-move-velocity';

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: 500 },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('getPlayerMoveVelocity', () => {
  it('should give the whole walking speed when the player is warm', () => {
    expect(getPlayerMoveVelocity(createPlayerWithCold(0))).toBe(
      PLAYER_MAX_MOVE_VELOCITY,
    );
  });

  it('should give half the walking speed when the player is cold', () => {
    expect(getPlayerMoveVelocity(createPlayerWithCold(2))).toBeCloseTo(
      PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR,
      6,
    );
  });

  it('should leave the given player alone when it reads the walking speed', () => {
    const player = createPlayerWithCold(2);

    getPlayerMoveVelocity(player);

    expect(player).toEqual(createPlayerWithCold(2));
  });
});
