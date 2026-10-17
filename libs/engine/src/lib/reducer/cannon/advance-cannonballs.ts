import { type Cannonball, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { filter, map } from 'lodash-es';
import { isCannonballOutOfLevel } from './internal/is-cannonball-out-of-level';
import { patchCannonballPosition } from './internal/patch-cannonball-position';

export const advanceCannonballs = (
  level: Level,
  cannonballs: Cannonball[],
  elapsedSeconds: number,
): Cannonball[] =>
  filter(
    map(cannonballs, (cannonball) =>
      patchCannonballPosition(
        cannonball,
        Math.min(elapsedSeconds, MAX_TICK_SECONDS),
      ),
    ),
    (cannonball) => !isCannonballOutOfLevel(level, cannonball),
  );
