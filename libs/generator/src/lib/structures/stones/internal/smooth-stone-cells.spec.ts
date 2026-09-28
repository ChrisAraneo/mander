import { TILE_DIRT, type Tile } from '@mander/model';
import { every, flatten, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Field } from './field';
import { smoothStoneCells } from './smooth-stone-cells';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const SIZE = 30;

const PILLAR_COLUMN = 15;

const fill = (value: number): Field =>
  times(SIZE, () => times(SIZE, () => value));

const blockWithPillar = (): Field =>
  times(SIZE, (row) =>
    times(SIZE, (column) =>
      Number(row >= SIZE / 2 || (row >= 2 && column === PILLAR_COLUMN)),
    ),
  );

const smooth = (cells: Field) =>
  smoothStoneCells({ tiles: LEVEL, cells }).cells;

describe('smoothStoneCells', () => {
  it('should turn all of the buried dirt into stone when it is one big block', () => {
    expect(smooth(fill(1))).toEqual(fill(1));
  });

  it('should make no stone when nothing is buried', () => {
    expect(smooth(fill(0))).toEqual(fill(0));
  });

  it('should make no stone in a thin pillar of buried dirt', () => {
    const stones = smooth(blockWithPillar());

    expect(times(8, (row) => stones[row + 2][PILLAR_COLUMN])).toEqual(
      times(8, () => 0),
    );
    expect(stones[SIZE - 1][PILLAR_COLUMN]).toBe(1);
  });

  it('should only make stone where the dirt is buried', () => {
    const buried = flatten(blockWithPillar());

    expect(
      every(
        flatten(smooth(blockWithPillar())),
        (stone, index) => stone <= buried[index],
      ),
    ).toBe(true);
  });

  it('should keep the grid the same when it makes the stone', () => {
    expect(smoothStoneCells({ tiles: LEVEL, cells: [[0]] }).tiles).toBe(LEVEL);
  });
});
