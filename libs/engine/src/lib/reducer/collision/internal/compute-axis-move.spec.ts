import { describe, expect, it } from 'vitest';

import { computeAxisMove } from './compute-axis-move';
import type { Sweep } from './types/sweep';

const BOX_SIZE = 16;

const WALL_LEFT = 64;

const createSweep = (origin: number, delta: number): Sweep => ({
  origin,
  delta,
  size: BOX_SIZE,
  isColliding: (position) => position + BOX_SIZE > WALL_LEFT,
});

describe('computeAxisMove', () => {
  it('should keep the box where it is when it does not move', () => {
    const move = computeAxisMove(createSweep(30, 0));

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should move the box the whole way when nothing is in its path', () => {
    const move = computeAxisMove(createSweep(10, 20));

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should stop the box flush against the wall when it moves into it', () => {
    const move = computeAxisMove(createSweep(30, 40));

    expect(move).toEqual({ position: 48, isBlocked: true });
  });
});
