import { type Enemy, type Level } from '@mander/model';
import { pipe } from 'remeda';
import { patchDyingEnemy } from './patch-dying-enemy';

export const patchFadingEnemy = (
  level: Level,
  enemy: Enemy,
  death: number,
  deltaSeconds: number,
): Enemy =>
  pipe(
    enemy,
    (fading) => patchDyingEnemy(level, fading, deltaSeconds),
    (fallen): Enemy => ({
      ...fallen,
      timers: { ...fallen.timers, death: death + deltaSeconds },
    }),
  );
