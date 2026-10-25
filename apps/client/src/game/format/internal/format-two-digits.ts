import { padStart } from 'lodash-es';

export const formatTwoDigits = (value: number): string =>
  padStart(String(value), 2, '0');
