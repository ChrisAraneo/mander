import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blur } from './blur';

const TOTAL_WEIGHT = 118;

const SIZE = 21;

const MIDDLE = 10;

const createDot = (): number[][] =>
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

  it('should spread a lone cell out both across and down when it blurs the field', () => {
    const blurred = blur(createDot());

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

  it('should not reach farther than eight cells when it blurs a lone cell', () => {
    expect(blur(createDot())[MIDDLE][MIDDLE + 9]).toBe(0);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(blur([])).toEqual([]);
  });
});
