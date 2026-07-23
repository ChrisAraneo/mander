import { padStart } from 'lodash-es';

export const dailyDate = (date = new Date()): string => {
  const year = date.getUTCFullYear();
  const month = padStart(String(date.getUTCMonth() + 1), 2, '0');
  const day = padStart(String(date.getUTCDate()), 2, '0');
  return `${year}-${month}-${day}`;
};
