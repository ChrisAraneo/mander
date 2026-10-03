import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blurColumns } from './blur-columns';

const TOTAL_WEIGHT = 118;

const EDGE_WEIGHT = 65;

describe('blurColumns', () => {
  it('should keep a column the same when all of its cells are the same', () => {
    expect(blurColumns([[1], [1], [1]])).toEqual([[1], [1], [1]]);
  });

  it('should spread a lone cell out along its column when it blurs the field', () => {
    const blurred = blurColumns(times(21, (row) => [Number(row === 10)]));

    expect(blurred[10][0]).toBeCloseTo(12 / TOTAL_WEIGHT);
    expect(blurred[11][0]).toBeCloseTo(11 / TOTAL_WEIGHT);
    expect(blurred[18][0]).toBeCloseTo(2 / TOTAL_WEIGHT);
    expect(blurred[19][0]).toBe(0);
  });

  it('should repeat the edge cell when the blur reaches past the end of the column', () => {
    expect(
      blurColumns(times(20, (row) => [Number(row === 0)]))[0][0],
    ).toBeCloseTo(EDGE_WEIGHT / TOTAL_WEIGHT);
  });

  it('should not mix cells from other columns when it blurs the field', () => {
    expect(
      blurColumns([
        [1, 0],
        [1, 0],
      ]),
    ).toEqual([
      [1, 0],
      [1, 0],
    ]);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(blurColumns([])).toEqual([]);
  });
});
