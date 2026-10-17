import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
} from '../../player/consts';
import { patchHurtPlayer } from './patch-hurt-player';

const createPlayerWith = (hearts: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 0, max: 500 },
  },
  hearts: { value: hearts },
  timers: { death: null, invincibility: 0, star: 1.5, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('patchHurtPlayer', () => {
  it('should take one heart away and make the player invincible and flash when the player is hurt', () => {
    const hurt = patchHurtPlayer(createPlayerWith(3));

    expect(hurt).toEqual({
      ...createPlayerWith(2),
      timers: {
        death: null,
        invincibility: HURT_INVINCIBLE_SECONDS,
        star: 1.5,
        hurt: HURT_FLASH_SECONDS,
      },
    });
  });

  it('should keep the star and death timers when the player is hurt', () => {
    const hurt = patchHurtPlayer(createPlayerWith(3));

    expect(hurt.timers.star).toBe(1.5);
    expect(hurt.timers.death).toBe(null);
  });

  it('should keep the hearts at zero when the player is hurt with no hearts left', () => {
    const hurt = patchHurtPlayer(createPlayerWith(0));

    expect(hurt.hearts).toEqual({ value: 0 });
  });

  it('should leave the given player alone when the player is hurt', () => {
    const player = createPlayerWith(3);

    patchHurtPlayer(player);

    expect(player).toEqual(createPlayerWith(3));
  });
});
