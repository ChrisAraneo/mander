import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS, PINKBALL_LOOPS } from './consts';
import { getFireballPosition } from './get-fireball-position';

const GERM_LOOP_TURN = (Math.PI * 2) / PINKBALL_LOOPS;

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

  it('should place the pink ball on its own block when its first loop begins', () => {
    expect(getFireballPosition(createPinkballAt(0))).toEqual({
      x: 100,
      y: 50,
    });
  });

  it('should fling the pink ball its full reach to the right when it is halfway round the first loop', () => {
    const position = getFireballPosition(createPinkballAt(Math.PI));

    expect(position.x).toBeCloseTo(100 + FIREBALL_ORBIT_RADIUS, 6);
    expect(position.y).toBeCloseTo(50, 6);
  });

  it('should carry the pink ball round the near side of its loop when it is a quarter of the way round', () => {
    const position = getFireballPosition(createPinkballAt(Math.PI / 2));

    expect(position.x).toBeCloseTo(100 + FIREBALL_ORBIT_RADIUS / 2, 6);
    expect(position.y).toBeCloseTo(50 - FIREBALL_ORBIT_RADIUS / 2, 6);
  });

  it('should bring the pink ball back onto its block when the first loop closes', () => {
    const position = getFireballPosition(createPinkballAt(2 * Math.PI));

    expect(position.x).toBeCloseTo(100, 6);
    expect(position.y).toBeCloseTo(50, 6);
  });

  it('should swing the pink ball out a sixth of a circle further round when it is halfway through the second loop', () => {
    const position = getFireballPosition(createPinkballAt(3 * Math.PI));

    expect(position.x).toBeCloseTo(
      100 + FIREBALL_ORBIT_RADIUS * Math.cos(GERM_LOOP_TURN),
      6,
    );
    expect(position.y).toBeCloseTo(
      50 + FIREBALL_ORBIT_RADIUS * Math.sin(GERM_LOOP_TURN),
      6,
    );
  });

  it('should start the pink ball over on its block when all six loops are flown', () => {
    const position = getFireballPosition(
      createPinkballAt(PINKBALL_LOOPS * 2 * Math.PI),
    );

    expect(position.x).toBeCloseTo(100, 6);
    expect(position.y).toBeCloseTo(50, 6);
  });
});
