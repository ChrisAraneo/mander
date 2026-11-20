import { TILE_DIRT, type Tile } from '@mander/model';
import { every, flatten, times, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeSmoothStoneCells } from './compute-smooth-stone-cells';
import type { Field } from './types/field';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const SIZE = 30;

const PILLAR_COLUMN = 15;

const PILLAR_TOP_ROW = 2;

const PILLAR_HEIGHT = 8;

const BURIED_HALVES = 2;

const createField = (value: number): Field =>
  times(SIZE, () => times(SIZE, () => value));

const createBlockWithPillar = (): Field =>
  times(SIZE, (row) =>
    times(SIZE, (column) =>
      toNumber(
        row >= SIZE / BURIED_HALVES ||
          (row >= PILLAR_TOP_ROW && column === PILLAR_COLUMN),
      ),
    ),
  );

const computeSmoothed = (cells: Field): Field =>
  computeSmoothStoneCells({ tiles: LEVEL, cells }).cells;

describe('computeSmoothStoneCells', () => {
  it('should turn all of the buried dirt into stone when it is one big block', () => {
    expect(computeSmoothed(createField(1))).toEqual(createField(1));
  });

  it('should make no stone when nothing is buried', () => {
    expect(computeSmoothed(createField(0))).toEqual(createField(0));
  });

  it('should make no stone when the buried dirt is a thin pillar', () => {
    const stones = computeSmoothed(createBlockWithPillar());

    expect(
      times(
        PILLAR_HEIGHT,
        (row) => stones[row + PILLAR_TOP_ROW][PILLAR_COLUMN],
      ),
    ).toEqual(times(PILLAR_HEIGHT, () => 0));
    expect(stones[SIZE - 1][PILLAR_COLUMN]).toBe(1);
  });

  it('should only make stone when the dirt is buried', () => {
    const buried = flatten(createBlockWithPillar());

    expect(
      every(
        flatten(computeSmoothed(createBlockWithPillar())),
        (stone, index) => stone <= buried[index],
      ),
    ).toBe(true);
  });

  it('should keep the grid the same when it makes the stone', () => {
    expect(computeSmoothStoneCells({ tiles: LEVEL, cells: [[0]] }).tiles).toBe(
      LEVEL,
    );
  });

  it('should mark no stone when the field holds no rows at all', () => {
    expect(computeSmoothed([])).toEqual([]);
  });
});
