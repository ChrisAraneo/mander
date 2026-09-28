import { TILE_AIR, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { chunk, filter, map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import { shuffleByColumn } from './shuffle-by-column';

const WIDTH = 40;

const LEVEL: Tile[][] = [times(WIDTH, () => TILE_AIR)];

const SLOTS: Spot[][] = chunk(
  map(range(WIDTH), (column) => ({ row: 5, column })),
  4,
);

const shuffleWith = (slots: Spot[][], seed = 'gems') =>
  shuffleByColumn(LEVEL, slots, createRandom(seed));

const dropColumn = (slots: Spot[][], dropped: number) =>
  map(slots, (slot) => filter(slot, ({ column }) => column !== dropped));

describe('shuffleByColumn', () => {
  it('should keep every candidate in its slot when it shuffles them', () => {
    expect(map(shuffleWith(SLOTS), (slot) => sortBy(slot, 'column'))).toEqual(
      SLOTS,
    );
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

  it('should keep the other candidates in the same order when a column has no candidate', () => {
    expect(shuffleWith(dropColumn(SLOTS, 1))).toEqual(
      dropColumn(shuffleWith(SLOTS), 1),
    );
  });

  it('should give empty slots back when it gets empty slots', () => {
    expect(shuffleWith([[], []])).toEqual([[], []]);
  });
});
