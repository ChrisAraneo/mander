import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
  STOMP_BOUNCE_VELOCITY,
} from '../../player/consts';
import { computeBounceVelocity } from './compute-bounce-velocity';

const START_X = 100;

const START_Y = 200;

const FALLING_SPEED = 150;

const HEARTS = 3;

const PLAYER: Player = {
  position: { x: START_X, y: START_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: FALLING_SPEED, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
};

describe('computeBounceVelocity', () => {
  it('should bounce the player up at full jump speed when the jump is held', () => {
    const velocity = computeBounceVelocity(PLAYER, true);

    expect(velocity).toBe(-PLAYER_MAX_JUMP_VELOCITY);
  });

  it('should bounce the player up at stomp speed when the jump is not held', () => {
    const velocity = computeBounceVelocity(PLAYER, false);

    expect(velocity).toBe(-STOMP_BOUNCE_VELOCITY);
  });
});
