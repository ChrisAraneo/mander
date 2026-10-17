import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createHeldCannonShot } from './create-held-cannon-shot';

const CANNON: Cannon = {
  position: { x: 320, y: 64 },
  timers: { reload: 0 },
  statuses: { isFacingRight: true },
};

describe('createHeldCannonShot', () => {
  it('should keep the same cannon and fire no cannonball when the cannon holds its fire', () => {
    const shot = createHeldCannonShot(CANNON);

    expect(shot).toEqual({ cannon: CANNON, cannonball: undefined });
    expect(shot.cannon).toBe(CANNON);
  });
});
