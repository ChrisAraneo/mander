import { padStart } from 'lodash-es';

const pad2 = (value: number): string => padStart(String(value), 2, '0');

export const dailyDate = (date = new Date()): string =>
  [date.getUTCFullYear(), pad2(date.getUTCMonth() + 1), pad2(date.getUTCDate())].join(
    '-',
  );
