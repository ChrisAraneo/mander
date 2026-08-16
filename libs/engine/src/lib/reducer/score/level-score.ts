import { round } from 'lodash-es';

import {
  LEVEL_SCORE_BASE,
  LEVEL_SCORE_MIN,
  LEVEL_SCORE_PER_SECOND,
} from './consts';

// Scalar Math.max stays: lodash `max` is array-only and returns `number | undefined`.
export const levelScore = (seconds: number): number =>
  Math.max(
    LEVEL_SCORE_MIN,
    LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * round(seconds),
  );
