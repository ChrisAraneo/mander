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

const createStandingPlayer = (): Player => ({
  position: { x: 100, y: 200 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerHitbox', () => {
  it('should give left = position.x + PLAYER_HITBOX_INSET_X and right = position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X when it is given a player', () => {
    const player = createStandingPlayer();

    const hitbox = computePlayerHitbox(player);

    expect(hitbox.left).toBe(100 + PLAYER_HITBOX_INSET_X);
    expect(hitbox.right).toBe(100 + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X);
    expect(hitbox.left).toBe(104);
    expect(hitbox.right).toBe(118);
  });

  it('should give top = position.y + PLAYER_HITBOX_INSET_TOP and bottom = position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM when it is given a player', () => {
    const player = createStandingPlayer();

    const hitbox = computePlayerHitbox(player);

    expect(hitbox.top).toBe(200 + PLAYER_HITBOX_INSET_TOP);
    expect(hitbox.bottom).toBe(
      200 + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM,
    );
    expect(hitbox.top).toBe(202);
    expect(hitbox.bottom).toBe(248);
  });

  it('should leave the player unchanged when it builds the hitbox', () => {
    const player = createStandingPlayer();

    computePlayerHitbox(player);

    expect(player).toEqual(createStandingPlayer());
  });
});
