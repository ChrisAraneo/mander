import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PINKBALL_HALF_CYCLE_ANGLE } from '../consts';
import { createPinkballPair } from './create-pinkball-pair';

const PRECISION = 6;

const PAIR_SIZE = 2;

const BLOCK_CENTRE = { x: 48, y: 16 };

const START_ANGLE = 1;

const createPinkball = (): Fireball => ({
  kind: 'PINK',
  spin: 'CLOCKWISE',
  origin: BLOCK_CENTRE,
  angle: START_ANGLE,
});

describe('createPinkballPair', () => {
  it('should hand back two balls when it pairs a ball up', () => {
    expect(createPinkballPair(createPinkball())).toHaveLength(PAIR_SIZE);
  });

  it('should keep the given ball first when it pairs a ball up', () => {
    const [pinkball] = createPinkballPair(createPinkball());

    expect(pinkball).toEqual(createPinkball());
  });

  it('should send the counter round the other way when it pairs a ball up', () => {
    const [, counter] = createPinkballPair(createPinkball());

    expect(counter.spin).toBe('ANTICLOCKWISE');
  });

  it('should set the counter off half a cycle on when it pairs a ball up', () => {
    const [, counter] = createPinkballPair(createPinkball());

    expect(counter.angle).toBeCloseTo(
      START_ANGLE + PINKBALL_HALF_CYCLE_ANGLE,
      PRECISION,
    );
  });

  it('should hang the counter on the same block when it pairs a ball up', () => {
    const [, counter] = createPinkballPair(createPinkball());

    expect(counter.origin).toEqual(BLOCK_CENTRE);
  });

  it('should leave the given ball unchanged when it pairs a ball up', () => {
    const pinkball = createPinkball();

    createPinkballPair(pinkball);

    expect(pinkball).toEqual(createPinkball());
  });
});
