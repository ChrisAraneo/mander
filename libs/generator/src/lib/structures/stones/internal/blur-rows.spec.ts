import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blurRows } from './blur-rows';

const TOTAL_WEIGHT = 118;

const EDGE_WEIGHT = 65;

describe('blurRows', () => {
  it('should keep a row the same when all of its cells are the same', () => {
    expect(blurRows([[1, 1, 1, 1]])).toEqual([[1, 1, 1, 1]]);
  });

  it('should spread a lone cell out along its row when it blurs the field', () => {
    const blurred = blurRows([times(21, (column) => Number(column === 10))]);

    expect(blurred[0][10]).toBeCloseTo(12 / TOTAL_WEIGHT);
    expect(blurred[0][9]).toBeCloseTo(11 / TOTAL_WEIGHT);
    expect(blurred[0][2]).toBeCloseTo(2 / TOTAL_WEIGHT);
    expect(blurred[0][1]).toBe(0);
  });

  it('should repeat the edge cell when the blur reaches past the end of the row', () => {
    expect(
      blurRows([times(20, (column) => Number(column === 0))])[0][0],
    ).toBeCloseTo(EDGE_WEIGHT / TOTAL_WEIGHT);
  });

  it('should not mix cells from other rows when it blurs the field', () => {
    expect(
      blurRows([
        [1, 1],
        [0, 0],
      ]),
    ).toEqual([
      [1, 1],
      [0, 0],
    ]);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(blurRows([])).toEqual([]);
  });
});
