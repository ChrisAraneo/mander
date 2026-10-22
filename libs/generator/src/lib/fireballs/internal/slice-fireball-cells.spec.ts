import { TILE_FIREBALL, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Cell } from '../../types/cell';
import { sliceFireballCells } from './slice-fireball-cells';

const LEVEL: Tile[][] = [[TILE_FIREBALL]];

const createCells = (count: number): Cell[] =>
  map(range(count), (column) => ({ row: 0, column }));

const sliceWith = (count: number, rate: number) =>
  sliceFireballCells({ tiles: LEVEL, rate, cells: createCells(count) }).cells;

describe('sliceFireballCells', () => {
  it('should take every spot when the rate is whole', () => {
    expect(sliceWith(4, 1)).toEqual(createCells(4));
  });

  it('should take the first spots when the rate is part of them', () => {
    expect(sliceWith(4, 0.5)).toEqual(createCells(2));
  });

  it('should round the count when the rate does not split the spots evenly', () => {
    expect(sliceWith(3, 0.5)).toEqual(createCells(2));
    expect(sliceWith(3, 0.3)).toEqual(createCells(1));
  });

  it('should take no spots when the rate is none', () => {
    expect(sliceWith(4, 0)).toEqual([]);
  });

  it('should take no spots when it gets no spots', () => {
    expect(sliceWith(0, 1)).toEqual([]);
  });

  it('should keep the grid the same when it takes the spots', () => {
    expect(sliceFireballCells({ tiles: LEVEL, rate: 1, cells: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
