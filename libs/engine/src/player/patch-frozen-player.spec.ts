import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { COLD_SECONDS } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { patchFrozenPlayer } from './patch-frozen-player';

const START_X = 100;

const START_Y = 200;

const HEARTS = 3;

const NO_COLD = 0;

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('patchFrozenPlayer', () => {
  it('should put the whole cold on the player when an ice ball swept through them', () => {
    expect(
      patchFrozenPlayer(createPlayerWithCold(NO_COLD), true).timers.cold,
    ).toBe(COLD_SECONDS);
  });

  it('should hand the same player back when no ice ball touched them', () => {
    const player = createPlayerWithCold(NO_COLD);

    expect(patchFrozenPlayer(player, false)).toBe(player);
  });

  it('should leave the player it was handed untouched when an ice ball swept through them', () => {
    const player = createPlayerWithCold(NO_COLD);

    patchFrozenPlayer(player, true);

    expect(player).toEqual(createPlayerWithCold(NO_COLD));
  });
});
