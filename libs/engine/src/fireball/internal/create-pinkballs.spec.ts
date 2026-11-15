import { createRandom } from '@mander/common';
import type { Point } from '@mander/model';
import { map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPinkballs } from './create-pinkballs';

const SEED = 'SEED';

const OTHER_SEED = 'OTHER';

const PRECISION = 6;

const PAIR_SIZE = 2;

const SPIN_COUNT = 2;

const TILE: Point = { x: 3, y: 1 };

describe('createPinkballs', () => {
  it('should hang two balls on the block when it pairs them up', () => {
    expect(size(createPinkballs(TILE, createRandom(SEED)))).toBe(PAIR_SIZE);
  });

  it('should make both of them pink balls when it pairs them up', () => {
    expect(
      map(createPinkballs(TILE, createRandom(SEED)), (ball) => ball.kind),
    ).toEqual(['PINK', 'PINK']);
  });

  it('should send one round each way when it pairs them up', () => {
    expect(
      size(
        uniq(
          map(createPinkballs(TILE, createRandom(SEED)), (ball) => ball.spin),
        ),
      ),
    ).toBe(SPIN_COUNT);
  });

  it('should hang both of them on the same block when it pairs them up', () => {
    const [pinkball, counter] = createPinkballs(TILE, createRandom(SEED));

    expect(counter.origin).toEqual(pinkball.origin);
  });

  it('should set them off on opposite sides when it pairs them up', () => {
    const [pinkball, counter] = createPinkballs(TILE, createRandom(SEED));

    expect(counter.angle).not.toBeCloseTo(pinkball.angle, PRECISION);
  });

  it('should pair the same two balls up when it is given the same seed twice', () => {
    expect(createPinkballs(TILE, createRandom(SEED))).toEqual(
      createPinkballs(TILE, createRandom(SEED)),
    );
  });

  it('should send the pair round the other way when it is given another seed', () => {
    expect(
      map(createPinkballs(TILE, createRandom(SEED)), (ball) => ball.spin),
    ).not.toEqual(
      map(createPinkballs(TILE, createRandom(OTHER_SEED)), (ball) => ball.spin),
    );
  });
});
