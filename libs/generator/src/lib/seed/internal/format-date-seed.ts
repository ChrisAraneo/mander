import { join, padStart } from 'lodash-es';

const DATE_PART_WIDTH = 2;

export const formatDateSeed = (date: Date): string =>
  join(
    [
      date.getUTCFullYear(),
      padStart(String(date.getUTCMonth() + 1), DATE_PART_WIDTH, '0'),
      padStart(String(date.getUTCDate()), DATE_PART_WIDTH, '0'),
    ],
    '-',
  );
