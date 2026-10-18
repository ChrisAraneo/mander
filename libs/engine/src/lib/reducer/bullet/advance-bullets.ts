import { type Bullet, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { filter, map } from 'lodash-es';
import { isBulletOutOfLevel } from './internal/is-bullet-out-of-level';
import { patchBulletPosition } from './internal/patch-bullet-position';

export const advanceBullets = (
  level: Level,
  bullets: Bullet[],
  elapsedSeconds: number,
): Bullet[] =>
  filter(
    map(bullets, (bullet) =>
      patchBulletPosition(bullet, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
    ),
    (bullet) => !isBulletOutOfLevel(level, bullet),
  );
