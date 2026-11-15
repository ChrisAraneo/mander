import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computePlayerHitbox } from './compute-player-hitbox';
import {
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';

const START_X = 100;

const START_Y = 200;

const HEARTS = 3;

const createStandingPlayer = (): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerHitbox', () => {
  it('should tuck the sides of the hitbox inside the player when the hitbox is worked out', () => {
    const player = createStandingPlayer();

    const hitbox = computePlayerHitbox(player);

    expect(hitbox.left).toBe(START_X + PLAYER_HITBOX_INSET_X);
    expect(hitbox.right).toBe(START_X + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X);
  });

  it('should tuck the top and the bottom of the hitbox inside the player when the hitbox is worked out', () => {
    const player = createStandingPlayer();

    const hitbox = computePlayerHitbox(player);

    expect(hitbox.top).toBe(START_Y + PLAYER_HITBOX_INSET_TOP);
    expect(hitbox.bottom).toBe(
      START_Y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM,
    );
  });

  it('should leave the player it was handed untouched when it builds the hitbox', () => {
    const player = createStandingPlayer();

    computePlayerHitbox(player);

    expect(player).toEqual(createStandingPlayer());
  });
});
