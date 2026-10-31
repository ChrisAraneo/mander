import type { Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { SNOWBALL_HITBOX_INSET, SNOWBALL_SIZE } from '../consts';
import { computeSnowballHitbox } from './compute-snowball-hitbox';

const createFlyingSnowball = (): Snowball => ({
  position: { x: 100, y: 200 },
  velocity: { x: { current: 220, max: 220 } },
});

describe('computeSnowballHitbox', () => {
  it('should give left/top = position + SNOWBALL_HITBOX_INSET and right/bottom = position + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET when it is given a snowball', () => {
    const snowball = createFlyingSnowball();

    const hitbox = computeSnowballHitbox(snowball);

    expect(hitbox.left).toBe(100 + SNOWBALL_HITBOX_INSET);
    expect(hitbox.right).toBe(100 + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET);
    expect(hitbox.top).toBe(200 + SNOWBALL_HITBOX_INSET);
    expect(hitbox.bottom).toBe(200 + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET);
  });

  it('should leave the snowball unchanged when it builds the hitbox', () => {
    const snowball = createFlyingSnowball();

    computeSnowballHitbox(snowball);

    expect(snowball).toEqual(createFlyingSnowball());
  });
});
