import { range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sumTaps } from './sum-taps';

const TOTAL_WEIGHT = 118;

describe('sumTaps', () => {
  it('should give the same value back when every tap sees it', () => {
    expect(sumTaps(() => 0.7)).toBeCloseTo(0.7);
  });

  it('should ask for every offset from eight back to eight ahead', () => {
    const offsets: number[] = [];

    sumTaps((offset) => {
      offsets.push(offset);

      return 0;
    });

    expect(offsets).toEqual(range(-8, 9));
  });

  it('should weigh the middle tap the most', () => {
    expect(sumTaps((offset) => Number(offset === 0))).toBeCloseTo(
      12 / TOTAL_WEIGHT,
    );
  });

  it('should weigh the farthest taps the least', () => {
    expect(sumTaps((offset) => Number(offset === 8))).toBeCloseTo(
      2 / TOTAL_WEIGHT,
    );
    expect(sumTaps((offset) => Number(offset === -8))).toBeCloseTo(
      2 / TOTAL_WEIGHT,
    );
  });
});
