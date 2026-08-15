import { type Bullet, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { filter, map } from 'lodash-es';

import { hasLeftLevel } from './has-left-level';
import { stepBullet } from './step-bullet';

export const advanceBullets = (
  level: Level,
  bullets: Bullet[],
  elapsedSeconds: number,
): Bullet[] =>
  filter(
    map(bullets, (bullet) =>
      stepBullet(bullet, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
    ),
    (bullet) => !hasLeftLevel(level, bullet),
  );
