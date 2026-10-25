import { floor, padStart } from 'lodash-es';
import { pipe } from 'remeda';

const SECONDS_PER_MINUTE = 60;

export const formatClock = (seconds: number): string =>
  pipe(
    floor(Math.max(0, seconds)),
    (total) => ({
      minutes: floor(total / SECONDS_PER_MINUTE),
      seconds: padStart(String(total % SECONDS_PER_MINUTE), 2, '0'),
    }),
    ({ minutes, seconds }) => `${minutes}:${seconds}`,
  );
