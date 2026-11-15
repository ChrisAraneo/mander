import type { Bullet, Level } from '@mander/model';
import { pipe } from 'remeda';
import { computeBulletTickSeconds } from './internal/compute-bullet-tick-seconds';
import { filterBulletsInLevel } from './internal/filter-bullets-in-level';
import { patchBulletFlight } from './internal/patch-bullet-flight';

export const nextBullets = (
  bullets: Bullet[],
  level: Level,
  elapsedSeconds: number,
): Bullet[] =>
  pipe(
    { bullets, level, elapsedSeconds },
    computeBulletTickSeconds,
    patchBulletFlight,
    filterBulletsInLevel,
  );
