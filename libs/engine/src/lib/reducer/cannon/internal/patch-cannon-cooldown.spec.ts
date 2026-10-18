import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchCannonCooldown } from './patch-cannon-cooldown';

const createCannon = (reload: number): Cannon => ({
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('patchCannonCooldown', () => {
  it('should count down the reload by the time that passed when the cannon is loading', () => {
    const cooled = patchCannonCooldown(createCannon(10), 0.5);

    expect(cooled.timers).toEqual({ reload: 9.5 });
  });

  it('should let the reload drop below zero when more time passes than was left', () => {
    const cooled = patchCannonCooldown(createCannon(0.2), 0.5);

    expect(cooled.timers.reload).toBeCloseTo(-0.3, 6);
  });

  it('should keep the position and the facing when it counts down the reload', () => {
    const cannon = createCannon(10);

    const cooled = patchCannonCooldown(cannon, 0.5);

    expect(cooled.position).toBe(cannon.position);
    expect(cooled.statuses).toBe(cannon.statuses);
  });

  it('should leave the given cannon alone when it counts down the reload', () => {
    const cannon = createCannon(10);

    patchCannonCooldown(cannon, 0.5);

    expect(cannon).toEqual(createCannon(10));
  });
});
