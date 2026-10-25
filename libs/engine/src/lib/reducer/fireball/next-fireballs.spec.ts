import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ANGULAR_SPEED } from './consts';
import { nextFireballs } from './next-fireballs';

const createFireballs = (): Fireball[] => [
  { spin: 'CLOCKWISE', origin: { x: 100, y: 50 }, angle: 1 },
  { spin: 'ANTICLOCKWISE', origin: { x: 300, y: 80 }, angle: 2 },
];

describe('nextFireballs', () => {
  it('should turn every fireball its own way when a short time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, 0.02);

    expect(advanced[0].angle).toBeCloseTo(1 + FIREBALL_ANGULAR_SPEED * 0.02, 6);
    expect(advanced[1].angle).toBeCloseTo(2 - FIREBALL_ANGULAR_SPEED * 0.02, 6);
  });

  it('should keep every fireball on its own block and spin when time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, 0.02);

    expect(advanced[0].origin).toEqual({ x: 100, y: 50 });
    expect(advanced[0].spin).toBe('CLOCKWISE');
    expect(advanced[1].origin).toEqual({ x: 300, y: 80 });
    expect(advanced[1].spin).toBe('ANTICLOCKWISE');
  });

  it('should turn every fireball only as far as one longest tick when a long time passes', () => {
    const fireballs = createFireballs();

    const advanced = nextFireballs(fireballs, 1);

    expect(advanced[0].angle).toBeCloseTo(
      1 + FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      6,
    );
    expect(advanced[1].angle).toBeCloseTo(
      2 - FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      6,
    );
  });

  it('should give no fireballs when the level has none', () => {
    const advanced = nextFireballs([], 0.02);

    expect(advanced).toEqual([]);
  });

  it('should leave the given fireballs unchanged when time passes', () => {
    const fireballs = createFireballs();

    nextFireballs(fireballs, 0.02);

    expect(fireballs).toEqual(createFireballs());
  });
});
