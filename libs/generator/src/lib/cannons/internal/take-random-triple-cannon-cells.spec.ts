import { createRandom } from '@mander/common';
import type { Tile } from '@mander/model';
import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Cell } from '../../types/cell';
import { takeRandomTripleCannonCells } from './take-random-triple-cannon-cells';

const TILES: Tile[][] = [];

const MANY_CANNONS = 1000;

const SOME_CANNONS = 40;

const FEWEST_TAKEN = 450;

const MOST_TAKEN = 550;

const createCells = (count: number): Cell[] =>
  times(count, (column) => ({ row: 0, column }));

const takeRandomFrom = (count: number, seed: string): Cell[] =>
  takeRandomTripleCannonCells({
    tiles: TILES,
    random: createRandom(seed),
    cells: createCells(count),
  }).cells;

describe('takeRandomTripleCannonCells', () => {
  it('should take about half of the cannons when there are many of them', () => {
    const taken = takeRandomFrom(MANY_CANNONS, 'DAY-1');

    expect(size(taken)).toBeGreaterThan(FEWEST_TAKEN);
    expect(size(taken)).toBeLessThan(MOST_TAKEN);
  });

  it('should take the same cannons when the seed is the same', () => {
    expect(takeRandomFrom(SOME_CANNONS, 'DAY-1')).toEqual(
      takeRandomFrom(SOME_CANNONS, 'DAY-1'),
    );
  });

  it('should take other cannons when the seed is different', () => {
    expect(takeRandomFrom(SOME_CANNONS, 'DAY-1')).not.toEqual(
      takeRandomFrom(SOME_CANNONS, 'DAY-2'),
    );
  });

  it('should take nothing when there are no cannons', () => {
    expect(takeRandomFrom(0, 'DAY-1')).toEqual([]);
  });

  it('should pass the level on when it takes the cannons', () => {
    expect(
      takeRandomTripleCannonCells({
        tiles: TILES,
        random: createRandom('DAY-1'),
        cells: createCells(SOME_CANNONS),
      }).tiles,
    ).toBe(TILES);
  });
});
