import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeAxisMove } from './compute-axis-move';
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
  delta: number,
): Sweep => ({
  axis,
  level: LEVEL,
  originX,
  originY,
  width: 16,
  height: 16,
  delta,
});

describe('computeAxisMove', () => {
  it('should keep the box where it is when it does not move', () => {
    const move = computeAxisMove(createSweep('HORIZONTAL', 30, 40, 0));

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should move the box the whole way when nothing is in its path', () => {
    const move = computeAxisMove(createSweep('HORIZONTAL', 10, 40, 20));

    expect(move).toEqual({ position: 30, isBlocked: false });
  });

  it('should stop the box flush against the wall when it moves into it', () => {
    const move = computeAxisMove(createSweep('HORIZONTAL', 50, 40, 40));

    expect(move).toEqual({ position: 80, isBlocked: true });
  });

  it('should start from the top of the box when it moves up or down', () => {
    const move = computeAxisMove(createSweep('VERTICAL', 10, 40, 20));

    expect(move).toEqual({ position: 60, isBlocked: false });
  });
});
