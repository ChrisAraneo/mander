import { join, padStart, toString } from 'lodash-es';

const DATE_PART_WIDTH = 2;

export const formatDateSeed = (date: Date): string =>
  join(
    [
      date.getUTCFullYear(),
      padStart(toString(date.getUTCMonth() + 1), DATE_PART_WIDTH, '0'),
      padStart(toString(date.getUTCDate()), DATE_PART_WIDTH, '0'),
    ],
    '-',
  );
