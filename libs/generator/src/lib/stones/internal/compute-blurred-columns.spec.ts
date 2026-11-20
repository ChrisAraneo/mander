import { times, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBlurredColumns } from './compute-blurred-columns';
import {
  BLUR_EDGE_WEIGHT,
  BLUR_FAR_WEIGHT,
  BLUR_MIDDLE_WEIGHT,
  BLUR_NEAR_WEIGHT,
  BLUR_REACH,
  BLUR_TOTAL_WEIGHT,
} from './consts';

const FIELD_HEIGHT = BLUR_REACH * 2 + 5;

const MIDDLE_ROW = 10;

const SHORT_FIELD_HEIGHT = 20;

describe('computeBlurredColumns', () => {
  it('should keep a column the same when all of its cells are the same', () => {
    expect(computeBlurredColumns([[1], [1], [1]])).toEqual([[1], [1], [1]]);
  });

  it('should spread a lone cell out along its column when it blurs the field', () => {
    const blurred = computeBlurredColumns(
      times(FIELD_HEIGHT, (row) => [toNumber(row === MIDDLE_ROW)]),
    );

    expect(blurred[MIDDLE_ROW][0]).toBeCloseTo(
      BLUR_MIDDLE_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[MIDDLE_ROW + 1][0]).toBeCloseTo(
      BLUR_NEAR_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[MIDDLE_ROW + BLUR_REACH][0]).toBeCloseTo(
      BLUR_FAR_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[MIDDLE_ROW + BLUR_REACH + 1][0]).toBe(0);
  });

  it('should repeat the edge cell when the blur reaches past the end of the column', () => {
    expect(
      computeBlurredColumns(
        times(SHORT_FIELD_HEIGHT, (row) => [toNumber(row === 0)]),
      )[0][0],
    ).toBeCloseTo(BLUR_EDGE_WEIGHT / BLUR_TOTAL_WEIGHT);
  });

  it('should not mix cells from other columns when it blurs the field', () => {
    expect(
      computeBlurredColumns([
        [1, 0],
        [1, 0],
      ]),
    ).toEqual([
      [1, 0],
      [1, 0],
    ]);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(computeBlurredColumns([])).toEqual([]);
  });
});
