import { times, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBlurredField } from './compute-blurred-field';
import {
  BLUR_MIDDLE_WEIGHT,
  BLUR_NEAR_WEIGHT,
  BLUR_REACH,
  BLUR_TOTAL_WEIGHT,
} from './consts';

const SIZE = BLUR_REACH * 2 + 5;

const MIDDLE = 10;

const createDot = (): number[][] =>
  times(SIZE, (row) =>
    times(SIZE, (column) => toNumber(row === MIDDLE && column === MIDDLE)),
  );

describe('computeBlurredField', () => {
  it('should keep the field the same when all of its cells are the same', () => {
    expect(
      computeBlurredField([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('should spread a lone cell out both across and down when it blurs the field', () => {
    const blurred = computeBlurredField(createDot());

    expect(blurred[MIDDLE][MIDDLE]).toBeCloseTo(
      (BLUR_MIDDLE_WEIGHT * BLUR_MIDDLE_WEIGHT) / BLUR_TOTAL_WEIGHT ** 2,
    );
    expect(blurred[MIDDLE][MIDDLE + 1]).toBeCloseTo(
      (BLUR_MIDDLE_WEIGHT * BLUR_NEAR_WEIGHT) / BLUR_TOTAL_WEIGHT ** 2,
    );
    expect(blurred[MIDDLE + 1][MIDDLE]).toBeCloseTo(
      (BLUR_NEAR_WEIGHT * BLUR_MIDDLE_WEIGHT) / BLUR_TOTAL_WEIGHT ** 2,
    );
    expect(blurred[MIDDLE + 1][MIDDLE + 1]).toBeCloseTo(
      (BLUR_NEAR_WEIGHT * BLUR_NEAR_WEIGHT) / BLUR_TOTAL_WEIGHT ** 2,
    );
  });

  it('should not reach farther than eight cells when it blurs a lone cell', () => {
    expect(
      computeBlurredField(createDot())[MIDDLE][MIDDLE + BLUR_REACH + 1],
    ).toBe(0);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(computeBlurredField([])).toEqual([]);
  });
});
