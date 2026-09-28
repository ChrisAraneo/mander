import { createRandom } from '@mander/utils';
import { chunk, floor, map, range, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import { shuffleBySpot } from './shuffle-by-spot';

const SLOTS: Spot[][] = chunk(
  map(range(40), (index) => ({ row: floor(index / 4), column: index % 4 })),
  8,
);

const shuffleWith = (slots: Spot[][], seed = 'gems') =>
  shuffleBySpot(slots, createRandom(seed));

describe('shuffleBySpot', () => {
  it('should keep every candidate in its slot when it shuffles them', () => {
    expect(
      map(shuffleWith(SLOTS), (slot) => sortBy(slot, ['row', 'column'])),
    ).toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles them', () => {
    expect(shuffleWith(SLOTS)).not.toEqual(SLOTS);
  });

  it('should shuffle the candidates the same way when it gets the same seed', () => {
    expect(shuffleWith(SLOTS)).toEqual(shuffleWith(SLOTS));
  });

  it('should shuffle the candidates another way when the seed is different', () => {
    expect(shuffleWith(SLOTS, 'gems')).not.toEqual(
      shuffleWith(SLOTS, 'stones'),
    );
  });

  it('should give empty slots back when it gets empty slots', () => {
    expect(shuffleWith([[], []])).toEqual([[], []]);
  });
});
