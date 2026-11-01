import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ORBIT_RADIUS,
  PINKBALL_SPIRAL_RADIUS,
  PINKBALL_SPIRAL_TURNS,
} from './consts';
import { getFireballPosition } from './get-fireball-position';

const SPIRAL_ARM = PINKBALL_SPIRAL_TURNS * 2 * Math.PI;

const createFireballAt = (angle: number): Fireball => ({
  kind: 'FIRE',
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 50 },
  angle,
});

const createPinkballAt = (angle: number): Fireball => ({
  ...createFireballAt(angle),
  kind: 'PINK',
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

  it('should place the pink ball out on the orbit when its spiral starts', () => {
    expect(getFireballPosition(createPinkballAt(0))).toEqual({
      x: 100 + FIREBALL_ORBIT_RADIUS,
      y: 50,
    });
  });

  it('should bring the pink ball back round to the same side but closer in when it has turned one arm of the spiral', () => {
    const position = getFireballPosition(createPinkballAt(SPIRAL_ARM));

    expect(position.x).toBeCloseTo(
      100 + FIREBALL_ORBIT_RADIUS - PINKBALL_SPIRAL_RADIUS,
      6,
    );
    expect(position.y).toBeCloseTo(50, 6);
  });

  it('should send the pink ball round and inwards at once when it is halfway along the arm', () => {
    const position = getFireballPosition(createPinkballAt(SPIRAL_ARM / 2));

    expect(position.x).toBeCloseTo(
      100 - (FIREBALL_ORBIT_RADIUS - PINKBALL_SPIRAL_RADIUS / 2),
      6,
    );
    expect(position.y).toBeCloseTo(50, 6);
  });

  it('should wind the pink ball back out to the full orbit when it has turned the whole cycle', () => {
    const position = getFireballPosition(createPinkballAt(2 * SPIRAL_ARM));

    expect(position.x).toBeCloseTo(100 + FIREBALL_ORBIT_RADIUS, 6);
    expect(position.y).toBeCloseTo(50, 6);
  });
});
