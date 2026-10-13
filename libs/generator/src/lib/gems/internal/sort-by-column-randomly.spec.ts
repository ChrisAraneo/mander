import { TILE_AIR, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { chunk, filter, map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../types/spot';
import { sortByColumnRandomly } from './sort-by-column-randomly';

const WIDTH = 40;

const LEVEL: Tile[][] = [times(WIDTH, () => TILE_AIR)];

const SLOTS: Spot[][] = chunk(
  map(range(WIDTH), (column) => ({ row: 5, column })),
  4,
);

const sortRandomlyWith = (slots: Spot[][], seed = 'gems') =>
  sortByColumnRandomly(LEVEL, slots, createRandom(seed));

const filterOtherColumns = (slots: Spot[][], dropped: number): Spot[][] =>
  map(slots, (slot) => filter(slot, ({ column }) => column !== dropped));

describe('sortByColumnRandomly', () => {
  it('should keep every candidate in its slot when it shuffles them', () => {
    expect(
      map(sortRandomlyWith(SLOTS), (slot) => sortBy(slot, 'column')),
    ).toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles them', () => {
    expect(sortRandomlyWith(SLOTS)).not.toEqual(SLOTS);
  });

  it('should shuffle the candidates the same way when it gets the same seed', () => {
    expect(sortRandomlyWith(SLOTS)).toEqual(sortRandomlyWith(SLOTS));
  });

  it('should shuffle the candidates another way when the seed is different', () => {
    expect(sortRandomlyWith(SLOTS, 'gems')).not.toEqual(
      sortRandomlyWith(SLOTS, 'stones'),
    );
  });

  it('should keep the other candidates in the same order when a column has no candidate', () => {
    expect(sortRandomlyWith(filterOtherColumns(SLOTS, 1))).toEqual(
      filterOtherColumns(sortRandomlyWith(SLOTS), 1),
    );
  });

  it('should give empty slots back when it gets empty slots', () => {
    expect(sortRandomlyWith([[], []])).toEqual([[], []]);
  });
});
