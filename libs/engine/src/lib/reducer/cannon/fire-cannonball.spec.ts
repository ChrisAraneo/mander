import { type Cannon, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SIZE, CANNONBALL_SPEED } from './consts';
import { fireCannonball } from './fire-cannonball';

const createCannon = (isFacingRight: boolean): Cannon => ({
  position: { x: 64, y: 32 },
  timers: { reload: 0 },
  statuses: { isFacingRight },
});

describe('fireCannonball', () => {
  it('should put the cannonball in the centre of the cannon tile when the cannon fires', () => {
    const cannon = createCannon(true);

    const cannonball = fireCannonball(cannon);

    expect(cannonball.position).toEqual({
      x: 64 + (TILE_SIZE - CANNONBALL_SIZE) / 2,
      y: 32 + (TILE_SIZE - CANNONBALL_SIZE) / 2,
    });
    expect(cannonball.position).toEqual({ x: 74, y: 42 });
  });

  it('should send the cannonball to the right at full speed when the cannon faces right', () => {
    const cannon = createCannon(true);

    const cannonball = fireCannonball(cannon);

    expect(cannonball.velocity).toEqual({
      x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    });
  });

  it('should send the cannonball to the left at full speed when the cannon faces left', () => {
    const cannon = createCannon(false);

    const cannonball = fireCannonball(cannon);

    expect(cannonball.velocity).toEqual({
      x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    });
  });

  it('should leave the cannon alone when it fires', () => {
    const cannon = createCannon(true);

    fireCannonball(cannon);

    expect(cannon).toEqual(createCannon(true));
  });
});
