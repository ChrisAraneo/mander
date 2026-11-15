import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ANGULAR_SPEED } from './consts';
import { nextFireballs } from './next-fireballs';

const PRECISION = 6;

const SHORT_TICK_SECONDS = 0.02;

const LONG_TICK_SECONDS = 1;

const FIRST_BLOCK_CENTRE = { x: 100, y: 50 };

const SECOND_BLOCK_CENTRE = { x: 300, y: 80 };

const FIRST_ANGLE = 1;

const SECOND_ANGLE = 2;

const createFireballs = (): Fireball[] => [
  {
    kind: 'FIRE',
    spin: 'CLOCKWISE',
    origin: FIRST_BLOCK_CENTRE,
    angle: FIRST_ANGLE,
  },
  {
    kind: 'FIRE',
    spin: 'ANTICLOCKWISE',
    origin: SECOND_BLOCK_CENTRE,
    angle: SECOND_ANGLE,
  },
];

describe('nextFireballs', () => {
  it('should turn every fireball its own way when a short time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, SHORT_TICK_SECONDS);

    expect(advanced[0].angle).toBeCloseTo(
      FIRST_ANGLE + FIREBALL_ANGULAR_SPEED * SHORT_TICK_SECONDS,
      PRECISION,
    );
    expect(advanced[1].angle).toBeCloseTo(
      SECOND_ANGLE - FIREBALL_ANGULAR_SPEED * SHORT_TICK_SECONDS,
      PRECISION,
    );
  });

  it('should keep every fireball on its own block and spin when time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, SHORT_TICK_SECONDS);

    expect(advanced[0].origin).toEqual(FIRST_BLOCK_CENTRE);
    expect(advanced[0].spin).toBe('CLOCKWISE');
    expect(advanced[1].origin).toEqual(SECOND_BLOCK_CENTRE);
    expect(advanced[1].spin).toBe('ANTICLOCKWISE');
  });

  it('should turn every fireball only as far as one longest tick when a long time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, LONG_TICK_SECONDS);

    expect(advanced[0].angle).toBeCloseTo(
      FIRST_ANGLE + FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      PRECISION,
    );
    expect(advanced[1].angle).toBeCloseTo(
      SECOND_ANGLE - FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      PRECISION,
    );
  });

  it('should give no fireballs when the level has none', () => {
    const advanced = nextFireballs([], SHORT_TICK_SECONDS);

    expect(advanced).toEqual([]);
  });

  it('should leave the given fireballs unchanged when time passes', () => {
    const fireballs = createFireballs();

    nextFireballs(fireballs, SHORT_TICK_SECONDS);

    expect(fireballs).toEqual(createFireballs());
  });
});
