import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createHeldFreezingShot } from './create-held-freezing-shot';

const FREEZER: Enemy = {
  kind: 'FREEZING',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload: 2 },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createHeldFreezingShot', () => {
  it('should hand back the same freezing enemy when the throw is held', () => {
    const shot = createHeldFreezingShot(FREEZER);

    expect(shot.enemy).toBe(FREEZER);
  });

  it('should throw nothing when the throw is held', () => {
    const shot = createHeldFreezingShot(FREEZER);

    expect(shot.snowball).toBeUndefined();
  });
});
