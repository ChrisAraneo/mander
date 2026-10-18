import { type Cannonball, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../consts';
import { patchCannonballPosition } from './patch-cannonball-position';

const createCannonball = (speed: number): Cannonball => ({
  position: { x: 100, y: TILE_SIZE },
  velocity: { x: { current: speed, max: CANNONBALL_SPEED } },
});

describe('patchCannonballPosition', () => {
  it('should move the cannonball to the right by its speed when it flies right', () => {
    const moved = patchCannonballPosition(
      createCannonball(CANNONBALL_SPEED),
      0.02,
    );

    expect(moved.position.x).toBeCloseTo(104.4, 6);
    expect(moved.position.y).toBe(TILE_SIZE);
  });

  it('should move the cannonball to the left by its speed when it flies left', () => {
    const moved = patchCannonballPosition(
      createCannonball(-CANNONBALL_SPEED),
      0.02,
    );

    expect(moved.position.x).toBeCloseTo(95.6, 6);
    expect(moved.position.y).toBe(TILE_SIZE);
  });

  it('should keep the same velocity when it moves the cannonball', () => {
    const cannonball = createCannonball(CANNONBALL_SPEED);

    const moved = patchCannonballPosition(cannonball, 0.02);

    expect(moved.velocity).toBe(cannonball.velocity);
  });

  it('should leave the cannonball where it is when no time passes', () => {
    const moved = patchCannonballPosition(
      createCannonball(CANNONBALL_SPEED),
      0,
    );

    expect(moved.position).toEqual({ x: 100, y: TILE_SIZE });
  });

  it('should leave the given cannonball alone when it moves the cannonball', () => {
    const cannonball = createCannonball(CANNONBALL_SPEED);

    patchCannonballPosition(cannonball, 0.02);

    expect(cannonball).toEqual(createCannonball(CANNONBALL_SPEED));
  });
});
