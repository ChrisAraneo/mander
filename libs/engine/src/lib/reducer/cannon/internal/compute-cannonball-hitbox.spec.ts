import type { Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_HITBOX_INSET, CANNONBALL_SIZE } from '../consts';
import { computeCannonballHitbox } from './compute-cannonball-hitbox';

const createFlyingCannonball = (): Cannonball => ({
  position: { x: 100, y: 200 },
  velocity: { x: { current: 220, max: 220 } },
});

describe('computeCannonballHitbox', () => {
  it('should give left/top = position + CANNONBALL_HITBOX_INSET and right/bottom = position + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET when it is given a cannonball', () => {
    const cannonball = createFlyingCannonball();

    const hitbox = computeCannonballHitbox(cannonball);

    expect(hitbox.left).toBe(100 + CANNONBALL_HITBOX_INSET);
    expect(hitbox.right).toBe(100 + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET);
    expect(hitbox.top).toBe(200 + CANNONBALL_HITBOX_INSET);
    expect(hitbox.bottom).toBe(200 + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET);
    expect(hitbox).toEqual({ left: 102, right: 110, top: 202, bottom: 210 });
  });

  it('should leave the cannonball unchanged when it builds the hitbox', () => {
    const cannonball = createFlyingCannonball();

    computeCannonballHitbox(cannonball);

    expect(cannonball).toEqual(createFlyingCannonball());
  });
});
