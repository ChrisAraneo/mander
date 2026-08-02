import { padStart } from 'lodash-es';

const pad2 = (value: number): string => padStart(String(value), 2, '0');

/**
 * The day a run belongs to, in UTC. The generator builds its seeds off the
 * same UTC parts, so a run started at any hour anywhere lands on the same
 * eight levels as everybody else's.
 */
export const dailyDate = (date = new Date()): string =>
  [
    date.getUTCFullYear(),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
  ].join('-');
