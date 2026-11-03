import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  CANNON_AIM_SECONDS,
  CANNON_BARREL_TURN_SPEED,
  TRIPLE_CANNON_SPREAD_RADIANS,
} from '../consts';
import { patchCannonBarrel } from './patch-cannon-barrel';

const createCannon = (barrelAngle: number, reload: number): Cannon => ({
  kind: 'TRIPLE',
  barrelAngle,
  roundIndex: 0,
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('patchCannonBarrel', () => {
  it('should turn towards the next round by no more than its speed when the shot is close', () => {
    const cannon = patchCannonBarrel(createCannon(0, 0.5), 0.1);

    expect(cannon.barrelAngle).toBeCloseTo(-CANNON_BARREL_TURN_SPEED * 0.1, 6);
  });

  it('should stop on the angle of the round when one more step would pass it', () => {
    const cannon = patchCannonBarrel(
      createCannon(-TRIPLE_CANNON_SPREAD_RADIANS + 0.001, 0.2),
      0.1,
    );

    expect(cannon.barrelAngle).toBe(-TRIPLE_CANNON_SPREAD_RADIANS);
  });

  it('should reach the angle of the round before it fires when it starts turning from level', () => {
    expect(
      TRIPLE_CANNON_SPREAD_RADIANS / CANNON_BARREL_TURN_SPEED,
    ).toBeLessThan(CANNON_AIM_SECONDS);
  });

  it('should swing back to level when the shot is still a long way off', () => {
    const cannon = patchCannonBarrel(
      createCannon(TRIPLE_CANNON_SPREAD_RADIANS, 3),
      0.1,
    );

    expect(cannon.barrelAngle).toBeCloseTo(
      TRIPLE_CANNON_SPREAD_RADIANS - CANNON_BARREL_TURN_SPEED * 0.1,
      6,
    );
  });

  it('should keep the barrel where it is when it is already resting level', () => {
    expect(patchCannonBarrel(createCannon(0, 3), 0.1).barrelAngle).toBe(0);
  });

  it('should leave the given cannon alone when it turns the barrel', () => {
    const cannon = createCannon(0, 0.5);

    patchCannonBarrel(cannon, 0.1);

    expect(cannon).toEqual(createCannon(0, 0.5));
  });
});
