import { createRandom } from '@mander/engine';
import { chunk, floor, map, range, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../types/spot';
import { sortBySpotRandomly } from './sort-by-spot-randomly';

const SLOTS: Spot[][] = chunk(
  map(range(40), (index) => ({ row: floor(index / 4), column: index % 4 })),
  8,
);

const sortRandomlyWith = (slots: Spot[][], seed = 'gems') =>
  sortBySpotRandomly(slots, createRandom(seed));

describe('sortBySpotRandomly', () => {
  it('should keep every candidate in its slot when it shuffles them', () => {
    expect(
      map(sortRandomlyWith(SLOTS), (slot) => sortBy(slot, ['row', 'column'])),
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

  it('should give empty slots back when it gets empty slots', () => {
    expect(sortRandomlyWith([[], []])).toEqual([[], []]);
  });
});
