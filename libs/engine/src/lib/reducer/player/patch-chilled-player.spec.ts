import type { Player, Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { SNOWBALL_SPEED } from '../snowball/consts';
import { COLD_SECONDS } from './consts';
import { patchChilledPlayer } from './patch-chilled-player';

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 0, max: 500 },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const SNOWBALL: Snowball = {
  position: { x: 105, y: 220 },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
};

describe('patchChilledPlayer', () => {
  it('should hand the same player back when no snowball landed', () => {
    const player = createPlayerWithCold(0);

    expect(patchChilledPlayer(player, [])).toBe(player);
  });

  it('should put the whole cold on the player when a snowball landed', () => {
    const chilled = patchChilledPlayer(createPlayerWithCold(0), [SNOWBALL]);

    expect(chilled.timers.cold).toBe(COLD_SECONDS);
  });

  it('should set the cold back to the whole time when a snowball lands on an already cold player', () => {
    const chilled = patchChilledPlayer(createPlayerWithCold(0.1), [SNOWBALL]);

    expect(chilled.timers.cold).toBe(COLD_SECONDS);
  });

  it('should take no hearts and leave the other timers alone when a snowball landed', () => {
    const player = createPlayerWithCold(0);

    const chilled = patchChilledPlayer(player, [SNOWBALL]);

    expect(chilled.hearts).toBe(player.hearts);
    expect(chilled.timers.death).toBeNull();
    expect(chilled.timers.invincibility).toBe(0);
    expect(chilled.timers.star).toBe(0);
    expect(chilled.timers.hurt).toBe(0);
  });

  it('should keep the place and the walk of the player when a snowball landed', () => {
    const player = createPlayerWithCold(0);

    const chilled = patchChilledPlayer(player, [SNOWBALL]);

    expect(chilled.position).toBe(player.position);
    expect(chilled.velocity).toBe(player.velocity);
    expect(chilled.statuses).toBe(player.statuses);
  });

  it('should leave the given player alone when a snowball landed', () => {
    const player = createPlayerWithCold(0);

    patchChilledPlayer(player, [SNOWBALL]);

    expect(player).toEqual(createPlayerWithCold(0));
  });
});
