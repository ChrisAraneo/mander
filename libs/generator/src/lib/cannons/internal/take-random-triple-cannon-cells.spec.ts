import { createRandom } from '@mander/engine';
import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Cell } from '../../types/cell';
import { takeRandomTripleCannonCells } from './take-random-triple-cannon-cells';

const createCells = (count: number): Cell[] =>
  times(count, (column) => ({ row: 0, column }));

describe('takeRandomTripleCannonCells', () => {
  it('should take about half of the cannons when there are many of them', () => {
    const taken = takeRandomTripleCannonCells(
      createCells(1000),
      createRandom('DAY-1'),
    );

    expect(size(taken)).toBeGreaterThan(450);
    expect(size(taken)).toBeLessThan(550);
  });

  it('should take the same cannons when the seed is the same', () => {
    expect(
      takeRandomTripleCannonCells(createCells(40), createRandom('DAY-1')),
    ).toEqual(
      takeRandomTripleCannonCells(createCells(40), createRandom('DAY-1')),
    );
  });

  it('should take other cannons when the seed is different', () => {
    expect(
      takeRandomTripleCannonCells(createCells(40), createRandom('DAY-1')),
    ).not.toEqual(
      takeRandomTripleCannonCells(createCells(40), createRandom('DAY-2')),
    );
  });

  it('should take nothing when there are no cannons', () => {
    expect(takeRandomTripleCannonCells([], createRandom('DAY-1'))).toEqual([]);
  });
});
