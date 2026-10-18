import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeHorizontalMove } from './compute-horizontal-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '.#..#.', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const LEVEL = createLevel();

describe('computeHorizontalMove', () => {
  it('should move the box the whole way when nothing is in its path', () => {
    const move = computeHorizontalMove(LEVEL, 70, 40, 16, 16, 20);

    expect(move).toEqual({ position: 90, isBlocked: false });
  });

  it('should stop the box flush against a solid tile when it moves right into one', () => {
    const move = computeHorizontalMove(LEVEL, 100, 40, 16, 16, 30);

    expect(move).toEqual({ position: 112, isBlocked: true });
  });

  it('should stop the box flush against a solid tile when it moves left into one', () => {
    const move = computeHorizontalMove(LEVEL, 80, 40, 16, 16, -30);

    expect(move).toEqual({ position: 64, isBlocked: true });
  });

  it('should stop the box at the side of the level when it moves left past it', () => {
    const move = computeHorizontalMove(LEVEL, 10, 8, 16, 16, -20);

    expect(move).toEqual({ position: 0, isBlocked: true });
  });

  it('should keep the box where it is when it does not move', () => {
    const move = computeHorizontalMove(LEVEL, 70, 40, 16, 16, 0);

    expect(move).toEqual({ position: 70, isBlocked: false });
  });

  it('should leave the level unchanged when it moves the box', () => {
    const level = createLevel();

    computeHorizontalMove(level, 100, 40, 16, 16, 30);

    expect(level).toEqual(createLevel());
  });
});
