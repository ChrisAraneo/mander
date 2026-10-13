import { range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeTapAverage } from './compute-tap-average';

const TOTAL_WEIGHT = 118;

describe('computeTapAverage', () => {
  it('should give the same value back when every tap sees it', () => {
    expect(computeTapAverage(() => 0.7)).toBeCloseTo(0.7);
  });

  it('should ask for every offset from eight back to eight ahead when it sums the taps', () => {
    const offsets: number[] = [];

    computeTapAverage((offset) => {
      offsets.push(offset);

      return 0;
    });

    expect(offsets).toEqual(range(-8, 9));
  });

  it('should weigh the middle tap the most when only the middle tap sees a value', () => {
    expect(computeTapAverage((offset) => Number(offset === 0))).toBeCloseTo(
      12 / TOTAL_WEIGHT,
    );
  });

  it('should weigh the farthest taps the least when only the farthest taps see a value', () => {
    expect(computeTapAverage((offset) => Number(offset === 8))).toBeCloseTo(
      2 / TOTAL_WEIGHT,
    );
    expect(computeTapAverage((offset) => Number(offset === -8))).toBeCloseTo(
      2 / TOTAL_WEIGHT,
    );
  });
});
