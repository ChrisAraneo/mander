import { type Cannonball, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { filter, map } from 'lodash-es';

import { hasLeftLevel } from './has-left-level';
import { stepCannonball } from './step-cannonball';

export const advanceCannonballs = (
  level: Level,
  cannonballs: Cannonball[],
  elapsedSeconds: number,
): Cannonball[] =>
  filter(
    map(cannonballs, (cannonball) =>
      stepCannonball(cannonball, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
    ),
    (cannonball) => !hasLeftLevel(level, cannonball),
  );
