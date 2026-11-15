import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeFireballPosition } from './compute-fireball-position';
import {
  FIREBALL_ORBIT_RADIUS,
  FULL_TURN,
  PINKBALL_CYCLE_ANGLE,
  PINKBALL_LOOP_ANGLE,
  PINKBALL_LOOP_RADIUS,
  QUARTER_TURN,
} from './consts';

const PRECISION = 6;

const BLOCK_LEFT = 100;

const BLOCK_TOP = 50;

const HALF_TURN = Math.PI;

const SIXTH_TURN = FULL_TURN / 6;

const SIXTH_TURN_COSINE = 0.5;

const SIXTH_TURN_SINE = Math.sqrt(3) / 2;

const createFireballAt = (angle: number): Fireball => ({
  kind: 'FIRE',
  spin: 'CLOCKWISE',
  origin: { x: BLOCK_LEFT, y: BLOCK_TOP },
  angle,
});

const createPinkballAt = (angle: number): Fireball => ({
  ...createFireballAt(angle),
  kind: 'PINK',
});

describe('computeFireballPosition', () => {
  it('should place the fireball to the right of its block when the angle is zero', () => {
    const position = computeFireballPosition(createFireballAt(0));

    expect(position).toEqual({
      x: BLOCK_LEFT + FIREBALL_ORBIT_RADIUS,
      y: BLOCK_TOP,
    });
  });

  it('should place the fireball round its block on the orbit when the angle is a sixth of a turn', () => {
    const position = computeFireballPosition(createFireballAt(SIXTH_TURN));

    expect(position.x).toBeCloseTo(
      BLOCK_LEFT + FIREBALL_ORBIT_RADIUS * SIXTH_TURN_COSINE,
      PRECISION,
    );
    expect(position.y).toBeCloseTo(
      BLOCK_TOP + FIREBALL_ORBIT_RADIUS * SIXTH_TURN_SINE,
      PRECISION,
    );
  });

  it('should place the pink ball on its own block when its first loop begins', () => {
    expect(computeFireballPosition(createPinkballAt(0))).toEqual({
      x: BLOCK_LEFT,
      y: BLOCK_TOP,
    });
  });

  it('should fling the pink ball its full reach to the right when it is halfway round the first loop', () => {
    const position = computeFireballPosition(createPinkballAt(HALF_TURN));

    expect(position.x).toBeCloseTo(
      BLOCK_LEFT + FIREBALL_ORBIT_RADIUS,
      PRECISION,
    );
    expect(position.y).toBeCloseTo(BLOCK_TOP, PRECISION);
  });

  it('should carry the pink ball round the near side of its loop when it is a quarter of the way round', () => {
    const position = computeFireballPosition(createPinkballAt(QUARTER_TURN));

    expect(position.x).toBeCloseTo(
      BLOCK_LEFT + PINKBALL_LOOP_RADIUS,
      PRECISION,
    );
    expect(position.y).toBeCloseTo(BLOCK_TOP - PINKBALL_LOOP_RADIUS, PRECISION);
  });

  it('should bring the pink ball back onto its block when the first loop closes', () => {
    const position = computeFireballPosition(createPinkballAt(FULL_TURN));

    expect(position.x).toBeCloseTo(BLOCK_LEFT, PRECISION);
    expect(position.y).toBeCloseTo(BLOCK_TOP, PRECISION);
  });

  it('should swing the pink ball out a sixth of a circle further round when it is halfway through the second loop', () => {
    const position = computeFireballPosition(
      createPinkballAt(FULL_TURN + HALF_TURN),
    );

    expect(position.x).toBeCloseTo(
      BLOCK_LEFT + FIREBALL_ORBIT_RADIUS * Math.cos(PINKBALL_LOOP_ANGLE),
      PRECISION,
    );
    expect(position.y).toBeCloseTo(
      BLOCK_TOP + FIREBALL_ORBIT_RADIUS * Math.sin(PINKBALL_LOOP_ANGLE),
      PRECISION,
    );
  });

  it('should start the pink ball over on its block when all six loops are flown', () => {
    const position = computeFireballPosition(
      createPinkballAt(PINKBALL_CYCLE_ANGLE),
    );

    expect(position.x).toBeCloseTo(BLOCK_LEFT, PRECISION);
    expect(position.y).toBeCloseTo(BLOCK_TOP, PRECISION);
  });

  it('should leave the fireball unchanged when it works out where it is', () => {
    const fireball = createFireballAt(SIXTH_TURN);

    computeFireballPosition(fireball);

    expect(fireball).toEqual(createFireballAt(SIXTH_TURN));
  });
});
