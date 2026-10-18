import type { Fireball } from '@mander/model';
import { times } from 'lodash-es';
import { FULL_TURN } from './consts';

export const createFireballRing = (
  count: number,
  origin: Fireball['origin'],
): Fireball[] =>
  times(count, (index): Fireball => ({
    spin: 'CLOCKWISE',
    origin,
    angle: (index * FULL_TURN) / count,
  }));
