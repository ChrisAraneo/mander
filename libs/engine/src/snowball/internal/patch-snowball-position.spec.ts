import { type Snowball, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { SNOWBALL_SPEED } from '../consts';
import { patchSnowballPosition } from './patch-snowball-position';

const createSnowball = (speed: number): Snowball => ({
  position: { x: 100, y: TILE_SIZE },
  velocity: { x: { current: speed, max: SNOWBALL_SPEED } },
});

describe('patchSnowballPosition', () => {
  it('should move the snowball to the right by its speed when it flies right', () => {
    const moved = patchSnowballPosition(createSnowball(SNOWBALL_SPEED), 0.02);

    expect(moved.position.x).toBeCloseTo(100 + SNOWBALL_SPEED * 0.02, 6);
    expect(moved.position.y).toBe(TILE_SIZE);
  });

  it('should move the snowball to the left by its speed when it flies left', () => {
    const moved = patchSnowballPosition(createSnowball(-SNOWBALL_SPEED), 0.02);

    expect(moved.position.x).toBeCloseTo(100 - SNOWBALL_SPEED * 0.02, 6);
    expect(moved.position.y).toBe(TILE_SIZE);
  });

  it('should keep the same velocity when it moves the snowball', () => {
    const snowball = createSnowball(SNOWBALL_SPEED);

    const moved = patchSnowballPosition(snowball, 0.02);

    expect(moved.velocity).toBe(snowball.velocity);
  });

  it('should leave the snowball where it is when no time passes', () => {
    const moved = patchSnowballPosition(createSnowball(SNOWBALL_SPEED), 0);

    expect(moved.position).toEqual({ x: 100, y: TILE_SIZE });
  });

  it('should leave the given snowball alone when it moves the snowball', () => {
    const snowball = createSnowball(SNOWBALL_SPEED);

    patchSnowballPosition(snowball, 0.02);

    expect(snowball).toEqual(createSnowball(SNOWBALL_SPEED));
  });
});
