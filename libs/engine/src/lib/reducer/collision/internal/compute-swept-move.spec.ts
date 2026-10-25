import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeSweptMove } from './compute-swept-move';
import type { Sweep } from './types/sweep';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '...#..', '......'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createSweep = (
  axis: Sweep['axis'],
  originX: number,
  originY: number,
): Sweep => ({
  axis,
  level: LEVEL,
  originX,
  originY,
  width: 16,
  height: 16,
  delta: 0,
});

describe('computeSweptMove', () => {
  it('should keep the box where it is when no distance is left', () => {
    const move = computeSweptMove(createSweep('HORIZONTAL', 30, 40), 1, 30, 0);

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should reach the end of the move when nothing is in the path', () => {
    const move = computeSweptMove(createSweep('HORIZONTAL', 10, 8), 1, 10, 25);

    expect(move).toEqual({ position: 35, isBlocked: false });
  });

  it('should stop the box flush against the wall when it moves right into it', () => {
    const move = computeSweptMove(createSweep('HORIZONTAL', 50, 40), 1, 50, 40);

    expect(move).toEqual({ position: 80, isBlocked: true });
  });

  it('should stop the box flush against the wall when it moves left into it', () => {
    const move = computeSweptMove(
      createSweep('HORIZONTAL', 140, 40),
      -1,
      140,
      -20,
    );

    expect(move).toEqual({ position: 128, isBlocked: true });
  });

  it('should stop at the wall rather than pass through it when the move is longer than the wall is wide', () => {
    const move = computeSweptMove(createSweep('HORIZONTAL', 50, 40), 1, 50, 80);

    expect(move).toEqual({ position: 80, isBlocked: true });
  });

  it('should stop the box flush on top of the wall when it falls onto it', () => {
    const move = computeSweptMove(createSweep('VERTICAL', 100, 0), 1, 0, 20);

    expect(move).toEqual({ position: 16, isBlocked: true });
  });
});
