import { map, range, size, sum } from 'lodash-es';

const BLUR_WEIGHTS = [12, 11, 10, 9, 8, 6, 4, 3, 2];

const BLUR_REACH = size(BLUR_WEIGHTS) - 1;

const BLUR_SPAN = range(-BLUR_REACH, BLUR_REACH + 1);

const BLUR_TAPS = map(BLUR_SPAN, (offset) => BLUR_WEIGHTS[Math.abs(offset)]);

const BLUR_TAP_COUNT = size(BLUR_TAPS);

const BLUR_WEIGHT = sum(BLUR_TAPS);

export const computeTapAverage = (
  sampleAt: (offset: number) => number,
): number => {
  // eslint-disable-next-line no-restricted-syntax -- measured 2026-10-10: 1e6 calls take 30 ms as this loop and 390 ms as a lodash reduce; generate() takes 400 ms against 585 ms
  let total = 0;

  // eslint-disable-next-line no-restricted-syntax -- measured 2026-10-10: see the note above
  for (let tap = 0; tap < BLUR_TAP_COUNT; tap++) {
    total += BLUR_TAPS[tap] * sampleAt(BLUR_SPAN[tap]);
  }

  return total / BLUR_WEIGHT;
};
