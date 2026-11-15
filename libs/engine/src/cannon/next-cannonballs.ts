import type { Cannonball, Level } from '@mander/model';
import { pipe } from 'remeda';
import { computeCannonballTickSeconds } from './internal/compute-cannonball-tick-seconds';
import { filterCannonballsInLevel } from './internal/filter-cannonballs-in-level';
import { patchCannonballFlight } from './internal/patch-cannonball-flight';

export const nextCannonballs = (
  cannonballs: Cannonball[],
  level: Level,
  deltaSeconds: number,
): Cannonball[] =>
  pipe(
    { cannonballs, level, deltaSeconds },
    computeCannonballTickSeconds,
    patchCannonballFlight,
    filterCannonballsInLevel,
  );
