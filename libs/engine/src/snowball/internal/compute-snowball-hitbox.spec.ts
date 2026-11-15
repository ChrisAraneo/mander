import type { Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  SNOWBALL_HITBOX_INSET,
  SNOWBALL_SIZE,
  SNOWBALL_SPEED,
} from '../consts';
import { computeSnowballHitbox } from './compute-snowball-hitbox';

const SNOWBALL_X = 100;

const SNOWBALL_Y = 200;

const createFlyingSnowball = (): Snowball => ({
  position: { x: SNOWBALL_X, y: SNOWBALL_Y },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('computeSnowballHitbox', () => {
  it('should draw the hitbox a little inside the snowball when a snowball flies', () => {
    const snowball = createFlyingSnowball();

    const hitbox = computeSnowballHitbox(snowball);

    expect(hitbox.left).toBe(SNOWBALL_X + SNOWBALL_HITBOX_INSET);
    expect(hitbox.right).toBe(
      SNOWBALL_X + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET,
    );
    expect(hitbox.top).toBe(SNOWBALL_Y + SNOWBALL_HITBOX_INSET);
    expect(hitbox.bottom).toBe(
      SNOWBALL_Y + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET,
    );
  });

  it('should leave the snowball unchanged when it builds the hitbox', () => {
    const snowball = createFlyingSnowball();

    computeSnowballHitbox(snowball);

    expect(snowball).toEqual(createFlyingSnowball());
  });
});
