import type { Cannon, CannonKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  CANNON_RELOAD_SECONDS,
  TRIPLE_CANNON_RELOAD_SECONDS,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
  TRIPLE_CANNON_SPREAD_RADIANS,
} from '../consts';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createCannonShot } from './create-cannon-shot';

const createCannon = (
  reload: number,
  kind: CannonKind,
  roundIndex = 0,
): Cannon => ({
  kind,
  barrelAngle: 0,
  roundIndex,
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('createCannonShot', () => {
  it('should fire a cannonball and start a new reload when the cannon has just loaded', () => {
    const cannon = createCannon(0, 'REGULAR');

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon, 0));
    expect(shot.cannon).toEqual({
      ...cannon,
      timers: { reload: CANNON_RELOAD_SECONDS },
    });
  });

  it('should carry the overshot time into the new reload when the cannon loaded a while ago', () => {
    const cannon = createCannon(-0.5, 'REGULAR');

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon, 0));
    expect(shot.cannon.timers.reload).toBe(-0.5 + CANNON_RELOAD_SECONDS);
    expect(shot.cannon.timers.reload).toBe(3);
  });

  it('should fire upwards and wait a short gap when a triple cannon fires its first round', () => {
    const cannon = createCannon(0, 'TRIPLE');

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(
      createFiredCannonball(cannon, -TRIPLE_CANNON_SPREAD_RADIANS),
    );
    expect(shot.cannon.roundIndex).toBe(1);
    expect(shot.cannon.timers.reload).toBe(TRIPLE_CANNON_SHOT_GAP_SECONDS);
  });

  it('should fire level and wait a short gap when a triple cannon fires its second round', () => {
    const cannon = createCannon(0, 'TRIPLE', 1);

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon, 0));
    expect(shot.cannon.roundIndex).toBe(2);
    expect(shot.cannon.timers.reload).toBe(TRIPLE_CANNON_SHOT_GAP_SECONDS);
  });

  it('should fire downwards and start over when a triple cannon fires its third round', () => {
    const cannon = createCannon(0, 'TRIPLE', 2);

    const shot = createCannonShot(cannon);

    expect(shot.cannonball).toEqual(
      createFiredCannonball(cannon, TRIPLE_CANNON_SPREAD_RADIANS),
    );
    expect(shot.cannon.roundIndex).toBe(0);
    expect(shot.cannon.timers.reload).toBeCloseTo(
      TRIPLE_CANNON_RELOAD_SECONDS - TRIPLE_CANNON_SHOT_GAP_SECONDS * 2,
      6,
    );
  });

  it('should keep the same cannon and fire nothing when the cannon is still loading', () => {
    const cannon = createCannon(0.5, 'REGULAR');

    const shot = createCannonShot(cannon);

    expect(shot.cannon).toBe(cannon);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should leave the given cannon alone when the cannon fires', () => {
    const cannon = createCannon(0, 'REGULAR');

    createCannonShot(cannon);

    expect(cannon).toEqual(createCannon(0, 'REGULAR'));
  });
});
