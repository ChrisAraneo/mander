import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { isFalling } from './is-falling';

const PLAYER_LEFT = 100;
const PLAYER_TOP = 200;
const RESTING_SPEED = 0;
const FALL_SPEED = 120;
const RISE_SPEED = -120;

const createPlayerMovingAt = (velocityY: number): Player => ({
  position: { x: PLAYER_LEFT, y: PLAYER_TOP },
  velocity: {
    ...createBasePlayerVelocity(),
    y: { ...createBasePlayerVelocity().y, current: velocityY },
  },
  hearts: { value: BASE_HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

describe('isFalling', () => {
  it('should say yes when the player moves downwards', () => {
    const isDropping = isFalling(createPlayerMovingAt(FALL_SPEED));

    expect(isDropping).toBe(true);
  });

  it('should say no when the player moves upwards', () => {
    const isDropping = isFalling(createPlayerMovingAt(RISE_SPEED));

    expect(isDropping).toBe(false);
  });

  it('should say no when the player is not moving up or down', () => {
    const isDropping = isFalling(createPlayerMovingAt(RESTING_SPEED));

    expect(isDropping).toBe(false);
  });

  it('should leave the player unchanged when it looks at the fall', () => {
    const player = createPlayerMovingAt(FALL_SPEED);

    isFalling(player);

    expect(player).toEqual(createPlayerMovingAt(FALL_SPEED));
  });
});
