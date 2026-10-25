import { join } from 'lodash-es';
import { formatTwoDigits } from './internal/format-two-digits';

export const serializeDay = (date: Date): string =>
  join(
    [
      date.getUTCFullYear(),
      formatTwoDigits(date.getUTCMonth() + 1),
      formatTwoDigits(date.getUTCDate()),
    ],
    '-',
  );
