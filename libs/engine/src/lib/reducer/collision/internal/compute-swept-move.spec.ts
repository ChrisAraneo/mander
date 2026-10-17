import { describe, expect, it } from 'vitest';

import { computeSweptMove } from './compute-swept-move';
import type { Sweep } from './types/sweep';

const BOX_SIZE = 16;

const WALL_LEFT = 64;

const createRecordingSweep = (
  checkedPositions: number[],
  wallLeft: number,
): Sweep => ({
  origin: 0,
  delta: 0,
  size: BOX_SIZE,
  isColliding: (position) =>
    checkedPositions.push(position) > 0 && position + BOX_SIZE > wallLeft,
});

describe('computeSweptMove', () => {
  it('should keep the box where it is when no distance is left', () => {
    const move = computeSweptMove(
      createRecordingSweep([], WALL_LEFT),
      1,
      30,
      0,
    );

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should check the path in small steps when the box moves right', () => {
    const checkedPositions: number[] = [];

    computeSweptMove(
      createRecordingSweep(checkedPositions, Infinity),
      1,
      0,
      20,
    );

    expect(checkedPositions).toEqual([8, 16, 20]);
  });

  it('should check the path in small steps when the box moves left', () => {
    const checkedPositions: number[] = [];

    computeSweptMove(
      createRecordingSweep(checkedPositions, Infinity),
      -1,
      30,
      -20,
    );

    expect(checkedPositions).toEqual([22, 14, 10]);
  });

  it('should stop at the first step that hits the wall when the box moves into it', () => {
    const checkedPositions: number[] = [];

    const move = computeSweptMove(
      createRecordingSweep(checkedPositions, WALL_LEFT),
      1,
      30,
      40,
    );

    expect(move).toEqual({ position: 48, isBlocked: true });
    expect(checkedPositions).toEqual([38, 46, 54]);
  });

  it('should reach the end of the move when nothing is in the path', () => {
    const move = computeSweptMove(
      createRecordingSweep([], Infinity),
      1,
      10,
      25,
    );

    expect(move).toEqual({ position: 35, isBlocked: false });
  });
});
