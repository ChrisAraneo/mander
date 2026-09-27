import { TILE_BEARTRAP, type Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickBeartrapCells } from './pick-beartrap-cells';

const LEVEL: Tile[][] = [[TILE_BEARTRAP]];

const createCells = (count: number) =>
  map(range(count), (column) => ({ row: 0, column }));

const pickWith = (count: number, rate: number) =>
  pickBeartrapCells({ tiles: LEVEL, rate, cells: createCells(count) }).cells;

describe('pickBeartrapCells', () => {
  it('should take every spot when the rate is whole', () => {
    expect(pickWith(4, 1)).toEqual(createCells(4));
  });

  it('should take the first spots when the rate is part of them', () => {
    expect(pickWith(4, 0.5)).toEqual(createCells(2));
  });

  it('should round the count when the rate does not split the spots evenly', () => {
    expect(pickWith(3, 0.5)).toEqual(createCells(2));
    expect(pickWith(3, 0.2)).toEqual(createCells(1));
  });

  it('should take no spots when the rate is none', () => {
    expect(pickWith(4, 0)).toEqual([]);
  });

  it('should take no spots when it gets no spots', () => {
    expect(pickWith(0, 1)).toEqual([]);
  });

  it('should keep the grid the same when it takes the spots', () => {
    expect(pickBeartrapCells({ tiles: LEVEL, rate: 1, cells: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
