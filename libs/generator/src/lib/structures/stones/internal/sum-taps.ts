import { map, range, size, sum } from 'lodash-es';

const BLUR_WEIGHTS = [12, 11, 10, 9, 8, 6, 4, 3, 2];

const BLUR_REACH = size(BLUR_WEIGHTS) - 1;

const BLUR_SPAN = range(-BLUR_REACH, BLUR_REACH + 1);

const BLUR_TAPS = map(BLUR_SPAN, (offset) => BLUR_WEIGHTS[Math.abs(offset)]);

const BLUR_WEIGHT = sum(BLUR_TAPS);

export const sumTaps = (sampleAt: (offset: number) => number): number => {
  let total = 0;

  for (let tap = 0; tap < BLUR_TAPS.length; tap++) {
    total += BLUR_TAPS[tap] * sampleAt(BLUR_SPAN[tap]);
  }

  return total / BLUR_WEIGHT;
};
