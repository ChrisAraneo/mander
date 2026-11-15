import type { Level, Snowball } from '@mander/model';
import { pipe } from 'remeda';
import { computeSnowballTickSeconds } from './internal/compute-snowball-tick-seconds';
import { filterSnowballsInLevel } from './internal/filter-snowballs-in-level';
import { patchSnowballFlight } from './internal/patch-snowball-flight';

export const nextSnowballs = (
  snowballs: Snowball[],
  level: Level,
  deltaSeconds: number,
): Snowball[] =>
  pipe(
    { snowballs, level, deltaSeconds },
    computeSnowballTickSeconds,
    patchSnowballFlight,
    filterSnowballsInLevel,
  );
