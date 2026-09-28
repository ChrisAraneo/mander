import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blur } from './blur';

const TOTAL_WEIGHT = 118;

const SIZE = 21;

const MIDDLE = 10;

const dot = () =>
  times(SIZE, (row) =>
    times(SIZE, (column) => Number(row === MIDDLE && column === MIDDLE)),
  );

describe('blur', () => {
  it('should keep the field the same when all of its cells are the same', () => {
    expect(
      blur([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('should spread a lone cell out both across and down', () => {
    const blurred = blur(dot());

    expect(blurred[MIDDLE][MIDDLE]).toBeCloseTo((12 * 12) / TOTAL_WEIGHT ** 2);
    expect(blurred[MIDDLE][MIDDLE + 1]).toBeCloseTo(
      (12 * 11) / TOTAL_WEIGHT ** 2,
    );
    expect(blurred[MIDDLE + 1][MIDDLE]).toBeCloseTo(
      (11 * 12) / TOTAL_WEIGHT ** 2,
    );
    expect(blurred[MIDDLE + 1][MIDDLE + 1]).toBeCloseTo(
      (11 * 11) / TOTAL_WEIGHT ** 2,
    );
  });

  it('should not reach farther than eight cells', () => {
    expect(blur(dot())[MIDDLE][MIDDLE + 9]).toBe(0);
  });
});
