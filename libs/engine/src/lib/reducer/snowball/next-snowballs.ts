import { type Level, MAX_TICK_SECONDS, type Snowball } from '@mander/model';
import { filter, map } from 'lodash-es';
import { isSnowballOutOfLevel } from './internal/is-snowball-out-of-level';
import { patchSnowballPosition } from './internal/patch-snowball-position';

export const nextSnowballs = (
  level: Level,
  snowballs: Snowball[],
  elapsedSeconds: number,
): Snowball[] =>
  filter(
    map(snowballs, (snowball) =>
      patchSnowballPosition(
        snowball,
        Math.min(elapsedSeconds, MAX_TICK_SECONDS),
      ),
    ),
    (snowball) => !isSnowballOutOfLevel(level, snowball),
  );
