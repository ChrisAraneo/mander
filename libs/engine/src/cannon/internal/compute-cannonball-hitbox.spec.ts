import type { Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  CANNONBALL_HITBOX_INSET,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
} from '../consts';
import { computeCannonballHitbox } from './compute-cannonball-hitbox';

const BALL_LEFT = 100;
const BALL_TOP = 200;

const createFlyingCannonball = (): Cannonball => ({
  position: { x: BALL_LEFT, y: BALL_TOP },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

describe('computeCannonballHitbox', () => {
  it('should pull the bite box in from every edge of the ball when it is given a cannonball', () => {
    const cannonball = createFlyingCannonball();

    const hitbox = computeCannonballHitbox(cannonball);

    expect(hitbox).toEqual({
      left: BALL_LEFT + CANNONBALL_HITBOX_INSET,
      right: BALL_LEFT + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET,
      top: BALL_TOP + CANNONBALL_HITBOX_INSET,
      bottom: BALL_TOP + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET,
    });
  });

  it('should leave the cannonball unchanged when it builds the hitbox', () => {
    const cannonball = createFlyingCannonball();

    computeCannonballHitbox(cannonball);

    expect(cannonball).toEqual(createFlyingCannonball());
  });
});
