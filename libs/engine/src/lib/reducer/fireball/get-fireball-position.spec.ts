import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS } from './consts';
import { getFireballPosition } from './get-fireball-position';

const createFireballAt = (angle: number): Fireball => ({
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 50 },
  angle,
});

describe('getFireballPosition', () => {
  it('should place the fireball to the right of its block when the angle is zero', () => {
    const position = getFireballPosition(createFireballAt(0));

    expect(position).toEqual({ x: 100 + FIREBALL_ORBIT_RADIUS, y: 50 });
  });

  it('should place the fireball round its block on the orbit when the angle is a sixth of a turn', () => {
    const position = getFireballPosition(createFireballAt(Math.PI / 3));

    expect(position.x).toBeCloseTo(100 + FIREBALL_ORBIT_RADIUS / 2, 6);
    expect(position.y).toBeCloseTo(
      50 + (FIREBALL_ORBIT_RADIUS * Math.sqrt(3)) / 2,
      6,
    );
  });

  it('should place the fireball at the given distance when it is given a radius', () => {
    const position = getFireballPosition(createFireballAt(Math.PI / 2), 10);

    expect(position.x).toBeCloseTo(100, 6);
    expect(position.y).toBeCloseTo(60, 6);
  });
});
