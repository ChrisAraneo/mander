import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { map } from 'lodash-es';
import { nextFireball } from './next-fireball';

export const nextFireballs = (
  fireballs: Fireball[],
  elapsedSeconds: number,
): Fireball[] =>
  map(fireballs, (fireball) =>
    nextFireball(fireball, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
  );
