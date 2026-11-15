import type { Player, Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { COLD_SECONDS } from '../../player/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { SNOWBALL_SPEED } from '../../snowball/consts';
import { patchColdTickPlayer } from './patch-cold-tick-player';

const START_X = 100;

const START_Y = 200;

const HEARTS = 3;

const NO_COLD = 0;

const SNOWBALL: Snowball = {
  position: { x: 105, y: 220 },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
};

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('patchColdTickPlayer', () => {
  it('should put the whole cold on the player when a snowball landed on them', () => {
    expect(
      patchColdTickPlayer(createPlayerWithCold(NO_COLD), [SNOWBALL], false)
        .timers.cold,
    ).toBe(COLD_SECONDS);
  });

  it('should put the whole cold on the player when an ice ball swept through them', () => {
    expect(
      patchColdTickPlayer(createPlayerWithCold(NO_COLD), [], true).timers.cold,
    ).toBe(COLD_SECONDS);
  });

  it('should put the whole cold on the player when both reached them in the same frame', () => {
    expect(
      patchColdTickPlayer(createPlayerWithCold(NO_COLD), [SNOWBALL], true)
        .timers.cold,
    ).toBe(COLD_SECONDS);
  });

  it('should hand the same player back when neither a snowball nor an ice ball touched them', () => {
    const player = createPlayerWithCold(NO_COLD);

    expect(patchColdTickPlayer(player, [], false)).toBe(player);
  });

  it('should leave the player it was handed untouched when a snowball landed on them', () => {
    const player = createPlayerWithCold(NO_COLD);

    patchColdTickPlayer(player, [SNOWBALL], true);

    expect(player).toEqual(createPlayerWithCold(NO_COLD));
  });
});
