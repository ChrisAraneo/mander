import { chain } from '@mander/utils';
import { floor, padStart } from 'lodash-es';

export const formatClock = (seconds: number): string =>
  chain(floor(Math.max(0, seconds)))
    .thru((total) => ({
      minutes: floor(total / 60),
      seconds: padStart(String(total % 60), 2, '0'),
    }))
    .thru(({ minutes, seconds }) => `${minutes}:${seconds}`)
    .value();
