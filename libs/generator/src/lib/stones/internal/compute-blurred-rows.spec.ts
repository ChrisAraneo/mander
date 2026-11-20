import { times, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBlurredRows } from './compute-blurred-rows';
import {
  BLUR_EDGE_WEIGHT,
  BLUR_FAR_WEIGHT,
  BLUR_MIDDLE_WEIGHT,
  BLUR_NEAR_WEIGHT,
  BLUR_REACH,
  BLUR_TOTAL_WEIGHT,
} from './consts';

const FIELD_WIDTH = BLUR_REACH * 2 + 5;

const MIDDLE_COLUMN = 10;

const NARROW_FIELD_WIDTH = 20;

describe('computeBlurredRows', () => {
  it('should keep a row the same when all of its cells are the same', () => {
    expect(computeBlurredRows([[1, 1, 1, 1]])).toEqual([[1, 1, 1, 1]]);
  });

  it('should spread a lone cell out along its row when it blurs the field', () => {
    const blurred = computeBlurredRows([
      times(FIELD_WIDTH, (column) => toNumber(column === MIDDLE_COLUMN)),
    ]);

    expect(blurred[0][MIDDLE_COLUMN]).toBeCloseTo(
      BLUR_MIDDLE_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[0][MIDDLE_COLUMN - 1]).toBeCloseTo(
      BLUR_NEAR_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[0][MIDDLE_COLUMN - BLUR_REACH]).toBeCloseTo(
      BLUR_FAR_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
    expect(blurred[0][MIDDLE_COLUMN - BLUR_REACH - 1]).toBe(0);
  });

  it('should repeat the edge cell when the blur reaches past the end of the row', () => {
    expect(
      computeBlurredRows([
        times(NARROW_FIELD_WIDTH, (column) => toNumber(column === 0)),
      ])[0][0],
    ).toBeCloseTo(BLUR_EDGE_WEIGHT / BLUR_TOTAL_WEIGHT);
  });

  it('should not mix cells from other rows when it blurs the field', () => {
    expect(
      computeBlurredRows([
        [1, 1],
        [0, 0],
      ]),
    ).toEqual([
      [1, 1],
      [0, 0],
    ]);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(computeBlurredRows([])).toEqual([]);
  });
});
