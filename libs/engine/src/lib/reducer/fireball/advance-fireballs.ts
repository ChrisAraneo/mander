import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { map } from 'lodash-es';

import { stepFireball } from './step-fireball';

export const advanceFireballs = (
  fireballs: Fireball[],
  elapsedSeconds: number,
): Fireball[] =>
  map(fireballs, (fireball) =>
    stepFireball(fireball, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
  );
