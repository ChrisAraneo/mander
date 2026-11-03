import { type Cannon, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
  TRIPLE_CANNON_SPREAD_RADIANS,
} from './consts';
import { createFiredCannonball } from './create-fired-cannonball';

const createCannon = (isFacingRight: boolean): Cannon => ({
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: 64, y: 32 },
  timers: { reload: 0 },
  statuses: { isFacingRight },
});

describe('createFiredCannonball', () => {
  it('should put the cannonball in the centre of the cannon tile when the cannon fires', () => {
    const cannon = createCannon(true);

    const cannonball = createFiredCannonball(cannon, 0);

    expect(cannonball.position).toEqual({
      x: 64 + (TILE_SIZE - CANNONBALL_SIZE) / 2,
      y: 32 + (TILE_SIZE - CANNONBALL_SIZE) / 2,
    });
    expect(cannonball.position).toEqual({ x: 74, y: 42 });
  });

  it('should send the cannonball to the right at full speed when the cannon faces right', () => {
    const cannon = createCannon(true);

    const cannonball = createFiredCannonball(cannon, 0);

    expect(cannonball.velocity).toEqual({
      x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
      y: { current: 0, max: CANNONBALL_SPEED },
    });
  });

  it('should send the cannonball to the left at full speed when the cannon faces left', () => {
    const cannon = createCannon(false);

    const cannonball = createFiredCannonball(cannon, 0);

    expect(cannonball.velocity).toEqual({
      x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
      y: { current: 0, max: CANNONBALL_SPEED },
    });
  });

  it('should send the cannonball upwards when the angle points up', () => {
    const cannonball = createFiredCannonball(
      createCannon(true),
      -TRIPLE_CANNON_SPREAD_RADIANS,
    );

    expect(cannonball.velocity.x.current).toBeCloseTo(206.732);
    expect(cannonball.velocity.y.current).toBeCloseTo(-75.244);
  });

  it('should send the cannonball downwards when the angle points down', () => {
    const cannonball = createFiredCannonball(
      createCannon(true),
      TRIPLE_CANNON_SPREAD_RADIANS,
    );

    expect(cannonball.velocity.x.current).toBeCloseTo(206.732);
    expect(cannonball.velocity.y.current).toBeCloseTo(75.244);
  });

  it('should leave the cannon alone when it fires', () => {
    const cannon = createCannon(true);

    createFiredCannonball(cannon, 0);

    expect(cannon).toEqual(createCannon(true));
  });
});
