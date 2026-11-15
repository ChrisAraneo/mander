import type { Cannon, CannonKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNON_AIM_SECONDS, TRIPLE_CANNON_SPREAD_RADIANS } from '../consts';
import { computeCannonBarrelTarget } from './compute-cannon-barrel-target';

const createCannon = (
  kind: CannonKind,
  roundIndex: number,
  reload: number,
): Cannon => ({
  kind,
  barrelAngle: 0,
  roundIndex,
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('computeCannonBarrelTarget', () => {
  it('should rest level when the next shot is still a long way off', () => {
    expect(
      computeCannonBarrelTarget(
        createCannon('TRIPLE', 0, CANNON_AIM_SECONDS + 0.01),
      ),
    ).toBe(0);
  });

  it('should aim up when the first round of a triple cannon is close', () => {
    expect(
      computeCannonBarrelTarget(createCannon('TRIPLE', 0, CANNON_AIM_SECONDS)),
    ).toBe(-TRIPLE_CANNON_SPREAD_RADIANS);
  });

  it('should aim level when the second round of a triple cannon is close', () => {
    expect(computeCannonBarrelTarget(createCannon('TRIPLE', 1, 0.3))).toBe(0);
  });

  it('should aim down when the third round of a triple cannon is close', () => {
    expect(computeCannonBarrelTarget(createCannon('TRIPLE', 2, 0.3))).toBe(
      TRIPLE_CANNON_SPREAD_RADIANS,
    );
  });

  it('should stay level when a regular cannon is about to fire', () => {
    expect(computeCannonBarrelTarget(createCannon('REGULAR', 0, 0.1))).toBe(0);
  });
});
