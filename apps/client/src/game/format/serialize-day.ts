import { join, padStart } from 'lodash-es';

const formatTwoDigits = (value: number): string =>
  padStart(String(value), 2, '0');

export const serializeDay = (date: Date): string =>
  join(
    [
      date.getUTCFullYear(),
      formatTwoDigits(date.getUTCMonth() + 1),
      formatTwoDigits(date.getUTCDate()),
    ],
    '-',
  );
