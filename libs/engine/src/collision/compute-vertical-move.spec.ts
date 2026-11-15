import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeVerticalMove } from './compute-vertical-move';

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

describe('computeVerticalMove', () => {
  it('should move the box the whole way down when it falls freely through the air', () => {
    const move = computeVerticalMove(LEVEL, 70, 8, 16, 16, 30);

    expect(move).toEqual({ position: 38, isBlocked: false });
  });

  it('should stop the box flush on top of the floor when it falls onto it', () => {
    const move = computeVerticalMove(LEVEL, 70, 72, 16, 16, 20);

    expect(move).toEqual({ position: 80, isBlocked: true });
  });

  it('should stop the box flush below a solid tile when it moves up into a ceiling', () => {
    const move = computeVerticalMove(LEVEL, 40, 70, 16, 16, -10);

    expect(move).toEqual({ position: 64, isBlocked: true });
  });

  it('should keep the box where it is when it does not move', () => {
    const move = computeVerticalMove(LEVEL, 70, 72, 16, 16, 0);

    expect(move).toEqual({ position: 72, isBlocked: false });
  });

  it('should leave the level unchanged when it moves the box', () => {
    const level = createLevel();

    computeVerticalMove(level, 70, 72, 16, 16, 20);

    expect(level).toEqual(createLevel());
  });
});
