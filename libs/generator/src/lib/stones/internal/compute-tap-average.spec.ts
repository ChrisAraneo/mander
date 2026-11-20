import { range, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeTapAverage } from './compute-tap-average';
import {
  BLUR_FAR_WEIGHT,
  BLUR_MIDDLE_WEIGHT,
  BLUR_REACH,
  BLUR_TOTAL_WEIGHT,
} from './consts';

const EVERY_VALUE = 0.7;

describe('computeTapAverage', () => {
  it('should give the same value back when every tap sees it', () => {
    expect(computeTapAverage(() => EVERY_VALUE)).toBeCloseTo(EVERY_VALUE);
  });

  it('should ask for every offset from eight back to eight ahead when it sums the taps', () => {
    const offsets: number[] = [];

    computeTapAverage((offset) => {
      offsets.push(offset);

      return 0;
    });

    expect(offsets).toEqual(range(-BLUR_REACH, BLUR_REACH + 1));
  });

  it('should weigh the middle tap the most when only the middle tap sees a value', () => {
    expect(computeTapAverage((offset) => toNumber(offset === 0))).toBeCloseTo(
      BLUR_MIDDLE_WEIGHT / BLUR_TOTAL_WEIGHT,
    );
  });

  it('should weigh the farthest taps the least when only the farthest taps see a value', () => {
    expect(
      computeTapAverage((offset) => toNumber(offset === BLUR_REACH)),
    ).toBeCloseTo(BLUR_FAR_WEIGHT / BLUR_TOTAL_WEIGHT);
    expect(
      computeTapAverage((offset) => toNumber(offset === -BLUR_REACH)),
    ).toBeCloseTo(BLUR_FAR_WEIGHT / BLUR_TOTAL_WEIGHT);
  });
});
