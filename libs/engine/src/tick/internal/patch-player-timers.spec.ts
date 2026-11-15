import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchPlayerTimers } from './patch-player-timers';

const createPlayerWith = (timers: Player['timers']): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 0, max: 500 },
  },
  hearts: { value: 3 },
  timers,
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('patchPlayerTimers', () => {
  it('should count the invincibility, star, hurt and cold timers down by the time passed when they are running', () => {
    const player = createPlayerWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.5,
      cold: 1.5,
    });

    const cooled = patchPlayerTimers(player, 0.25);

    expect(cooled.timers.invincibility).toBeCloseTo(0.75, 6);
    expect(cooled.timers.star).toBeCloseTo(1.75, 6);
    expect(cooled.timers.hurt).toBeCloseTo(0.25, 6);
    expect(cooled.timers.cold).toBeCloseTo(1.25, 6);
  });

  it('should stop the timers at zero when less time is left on them than has passed', () => {
    const player = createPlayerWith({
      death: null,
      invincibility: 0.1,
      star: 0,
      hurt: 0.05,
      cold: 0.2,
    });

    const cooled = patchPlayerTimers(player, 0.25);

    expect(cooled.timers).toEqual({
      death: null,
      invincibility: 0,
      star: 0,
      hurt: 0,
      cold: 0,
    });
  });

  it('should keep the death timer as it is when the player is dying', () => {
    const player = createPlayerWith({
      death: 0.4,
      invincibility: 0,
      star: 0,
      hurt: 0,
      cold: 0,
    });

    const cooled = patchPlayerTimers(player, 0.25);

    expect(cooled.timers.death).toBe(0.4);
  });

  it('should keep the rest of the player as it is when the timers count down', () => {
    const player = createPlayerWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.5,
      cold: 1,
    });

    const cooled = patchPlayerTimers(player, 0.25);

    expect({ ...cooled, timers: player.timers }).toEqual(player);
  });

  it('should leave the given player alone when the timers count down', () => {
    const player = createPlayerWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.5,
      cold: 1,
    });

    patchPlayerTimers(player, 0.25);

    expect(player).toEqual(
      createPlayerWith({
        death: null,
        invincibility: 1,
        star: 2,
        hurt: 0.5,
        cold: 1,
      }),
    );
  });
});
