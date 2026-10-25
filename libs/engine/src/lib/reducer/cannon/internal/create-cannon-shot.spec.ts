import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNON_RELOAD_SECONDS } from '../consts';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createCannonShot } from './create-cannon-shot';

const createCannon = (reload: number): Cannon => ({
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('createCannonShot', () => {
  it('should fire a cannonball and start a new reload when the cannon has just loaded', () => {
    const cannon = createCannon(0);

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon));
    expect(shot.cannon).toEqual({
      ...cannon,
      timers: { reload: CANNON_RELOAD_SECONDS },
    });
  });

  it('should carry the overshot time into the new reload when the cannon loaded a while ago', () => {
    const cannon = createCannon(-0.5);

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon));
    expect(shot.cannon.timers.reload).toBe(-0.5 + CANNON_RELOAD_SECONDS);
    expect(shot.cannon.timers.reload).toBe(3);
  });

  it('should keep the same cannon and fire nothing when the cannon is still loading', () => {
    const cannon = createCannon(0.5);

    const shot = createCannonShot(cannon);

    expect(shot.cannon).toBe(cannon);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should leave the given cannon alone when the cannon fires', () => {
    const cannon = createCannon(0);

    createCannonShot(cannon);

    expect(cannon).toEqual(createCannon(0));
  });
});
